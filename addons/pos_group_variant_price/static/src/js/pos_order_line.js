/** @odoo-module */
import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/store/pos_store";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { ProductProduct } from "@point_of_sale/app/models/product_product";
import { parseFloat } from "@web/views/fields/parsers";
import { roundDecimals, floatIsZero } from "@web/core/utils/numbers";
import { _t } from "@web/core/l10n/translation";

patch(ProductProduct.prototype, {


    get_price(pricelist, quantity, price_extra = 0, recurring = false, list_price = false, variant_qty = 1) {
        // In case of nested pricelists, it is necessary that all pricelists are made available in
        // the POS. Display a basic alert to the user in the case where there is a pricelist item
        // but we can't load the base pricelist to get the price when calling this method again.
        // As this method is also call without pricelist available in the POS, we can't just check
        // the absence of pricelist.
        if (recurring && !pricelist) {
            alert(
                _t(
                    "An error occurred when loading product prices. " +
                        "Make sure all pricelists are available in the POS."
                )
            );
        }

        const rules = !pricelist ? [] : this.cachedPricelistRules[pricelist?.id] || [];
        let price = (list_price || this.lst_price) + (price_extra || 0);
        const rule = rules.find((rule) => ( !rule.raw.product_id &&  (!rule.min_quantity || variant_qty >= rule.min_quantity) || ((rule.raw.product_id == this.raw.id ) &&  (!rule.min_quantity || quantity >= rule.min_quantity)) )  );
        if (!rule) {
            return price;
        }

        if (rule.base === "pricelist") {
            if (rule.base_pricelist_id) {
                price = this.get_price(
                       rule.base_pricelist_id, 
                       quantity, 
                       0, 
                       true, 
                       list_price,
                       variant_qty
                       );
            }
        } else if (rule.base === "standard_price") {
            price = this.standard_price;
        }

        if (rule.compute_price === "fixed") {
            price = rule.fixed_price;
        } else if (rule.compute_price === "percentage") {
            price = price - price * (rule.percent_price / 100);
        } else {
            var price_limit = price;
            price -= price * (rule.price_discount / 100);
            if (rule.price_round) {
                price = roundPrecision(price, rule.price_round);
            }
            if (rule.price_surcharge) {
                price += rule.price_surcharge;
            }
            if (rule.price_min_margin) {
                price = Math.max(price, price_limit + rule.price_min_margin);
            }
            if (rule.price_max_margin) {
                price = Math.min(price, price_limit + rule.price_max_margin);
            }
        }

        // This return value has to be rounded with round_di before
        // being used further. Note that this cannot happen here,
        // because it would cause inconsistencies with the backend for
        // pricelist that have base == 'pricelist'.
        return price;
    }

});


patch(PosStore.prototype, {


    async addLineToOrder(vals, order, opts = {}, configure = true) {
        let res = await super.addLineToOrder(vals,order,opts,configure)
        for (let line of order.lines){
                line.set_unit_price(line.get_unit_price()) //Force update even after merge 
        }
        return res
    }

});


patch(PosOrderline.prototype, {

    set_unit_price(price) {
        if (this.price_type === "original") {
	   let variant_qty = this.get_quantity()
           for (const line of this.order_id.lines.filter(
	       (l) => l.product_id.raw.product_tmpl_id == this.product_id.raw.product_tmpl_id && l.id !== this.id
	        )) {
	            variant_qty = variant_qty + line.get_quantity()
	    }

            price = this.product_id.get_price(
                    this.order_id.pricelist_id,
                    this.get_quantity(),
                    this.get_price_extra(),
                    undefined,
                    undefined,
                    variant_qty
                )
           for (const line of this.order_id.lines.filter(
	       (l) => l.product_id.raw.product_tmpl_id == this.product_id.raw.product_tmpl_id && l.id !== this.id
	        )) {
                    const line_price = line.product_id.get_price(
                        this.order_id.pricelist_id,
                        line.get_quantity(),
                        line.get_price_extra(),
                        undefined,
                        undefined,
                        variant_qty
                    )
                    const parsed_line_price = !isNaN(line_price)
                        ? line_price
                        : isNaN(parseFloat(line_price))
                        ? 0
                        : parseFloat("" + line_price);
                    line.price_unit = roundDecimals(
                        parsed_line_price || 0,
                        this.models["decimal.precision"].find((dp) => dp.name === "Product Price").digits
                    );
                    line.setDirty();
	    }

        }

        const parsed_price = !isNaN(price)
            ? price
            : isNaN(parseFloat(price))
            ? 0
            : parseFloat("" + price);
        this.price_unit = roundDecimals(
            parsed_price || 0,
            this.models["decimal.precision"].find((dp) => dp.name === "Product Price").digits
        );
        this.setDirty();
    },


    can_be_merged_with(orderline) {
        const productPriceUnit = this.models["decimal.precision"].find(
            (dp) => dp.name === "Product Price"
        ).digits;
        const price = window.parseFloat(
            roundDecimals(this.price_unit || 0, productPriceUnit).toFixed(productPriceUnit)
        );
        let variant_qty = orderline.get_quantity()
        for (const line of this.order_id.lines.filter(
            (l) => l.product_id.raw.product_tmpl_id == orderline.product_id.raw.product_tmpl_id && l.id !== orderline.id
	        )) {
	           variant_qty = variant_qty + line.get_quantity()
        }

        let order_line_price = orderline
            .get_product()
            .get_price(
            this.order_id.pricelist_id, 
            this.get_quantity(), 
            undefined,
            undefined,
            undefined,
            variant_qty
            );
        order_line_price = roundDecimals(order_line_price, this.currency.decimal_places);

        const isSameCustomerNote =
            (Boolean(orderline.get_customer_note()) === false &&
                Boolean(this.get_customer_note()) === false) ||
            orderline.get_customer_note() === this.get_customer_note();

        // only orderlines of the same product can be merged
        return (
            !this.skip_change &&
            orderline.getNote() === this.getNote() &&
            this.get_product().id === orderline.get_product().id &&
            this.is_pos_groupable() &&
            // don't merge discounted orderlines
            this.get_discount() === 0 &&
            floatIsZero(price - order_line_price - orderline.get_price_extra(), this.currency) &&
            !(
                this.product_id.tracking === "lot" &&
                (this.pickingType.use_create_lots || this.pickingType.use_existing_lots)
            ) &&
            this.full_product_name === orderline.full_product_name &&
            isSameCustomerNote &&
            !this.refunded_orderline_id &&
            !orderline.isPartOfCombo()
        );
    }


});
