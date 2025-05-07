/** @odoo-module */
import { patch } from "@web/core/utils/patch";
import { SelectPartnerButton } from "@point_of_sale/app/screens/product_screen/control_buttons/select_partner_button/select_partner_button";


//Patching SelectPartnerButton to disable customer
patch(SelectPartnerButton.prototype, {
    setup() {
        super.setup();
    },
    disable_customer() {
        if (this.pos.cashier?.disable_customer) {
            return true;
        } else {
            return false;
        }
    }
});
