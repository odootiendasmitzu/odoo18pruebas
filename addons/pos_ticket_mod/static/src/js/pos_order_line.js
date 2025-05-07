/** @odoo-module */
import { patch } from "@web/core/utils/patch";
import { omit } from "@web/core/utils/objects";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { _t } from "@web/core/l10n/translation";

patch(PosOrder.prototype, {


    export_for_printing(baseUrl, headerData) {
        const originalData = super.export_for_printing(baseUrl, headerData); // Llama al método original

        // Agrega el elemento personalizado
        const customData = {
            ...originalData,
            orderlines: this.getSortedOrderlines().map((l) =>
                omit(l.getDisplayData(true), "internalNote")
            ),

        };

        return customData;
    },



});


patch(PosOrderline.prototype, {

    getDisplayData(printing = false) {
        const originalData = super.getDisplayData(); // Llama al método original

        // Agrega el elemento personalizado
        const customData = {
            ...originalData,
            productName: this.get_full_product_name_ticket(printing)
        };

        return customData;
    },


    get_full_product_name_ticket(printing = false) {
        return (printing && this.product_id.raw.description_sale) || this.full_product_name || this.product_id.display_name;
    }


});
