/** @odoo-module **/

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { _t } from "@web/core/l10n/translation";
import {
    BACKSPACE,
    Numpad,
    getButtons,
    DEFAULT_LAST_ROW,
} from "@point_of_sale/app/generic_components/numpad/numpad";
import { patch } from "@web/core/utils/patch";

//Patching ProductScreen to disable buttons
patch(ProductScreen.prototype, {
    setup() {
        super.setup(...arguments);
    },

    getNumpadButtons() {
        const colorClassMap = {
            [this.env.services.localization.decimalPoint]: "o_colorlist_item_color_transparent_6",
            Backspace: "o_colorlist_item_color_transparent_1",
            "-": "o_colorlist_item_color_transparent_3",
        };

        var res = getButtons(DEFAULT_LAST_ROW, [
            { value: "quantity", text: _t("Qty"), disabled: this.pos.cashier?.disable_qty },
            { value: "discount", text: _t("%"), disabled: !this.pos.config?.manual_discount || this.pos.cashier?.disable_discount },
            {
                value: "price",
                text: _t("Price"),
                disabled: !this.pos.cashierHasPriceControlRights() || this.pos.cashier?.disable_price 
            },
            { value: "Backspace", text: "⌫", disabled: this.pos.cashier?.disable_remove_button },
        ])
        return res.map((button) => (
             {
            
            ...button,
            disabled: (button.disabled || (this.pos.cashier?.disable_numpad && /^[0-9,.]$/.test(button.value)) || (this.pos.cashier?.disable_plus_minus && /^[+-]$/.test(button.value))) ? true : false , 
            class: `
                ${colorClassMap[button.value] || ""}
                ${(!this.pos.cashier?.disable_numpad && this.pos.numpadMode === button.value)  ? "active" : ""}
                ${button.value === "quantity" ? "numpad-qty rounded-0 rounded-top mb-0" : ""}
                ${button.value === "price" ? "numpad-price rounded-0 rounded-bottom mt-0" : ""}
                ${
                    button.value === "discount"
                        ? "numpad-discount my-0 rounded-0 border-top border-bottom"
                        : ""
                }
            `,
        }


        ));
    }



});
