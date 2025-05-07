import { NumberPopup } from "@point_of_sale/app/utils/input_popups/number_popup";
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { useService } from "@web/core/utils/hooks";
import { makeAwaitable } from "@point_of_sale/app/store/make_awaitable_dialog";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";


// Parche para el botón de descuento
patch(ControlButtons.prototype, {


    async checkPassword(config_password) {
        let inputPin = false
        inputPin = await makeAwaitable(this.dialog, NumberPopup, {
                formatDisplayedValue: (x) => x.replace(/./g, "•"),
                title: _t("Password?"),
            });
        if (!inputPin || config_password !== Sha1.hash(inputPin)) {
            this.notification.add(_t("Password Error"), {
                type: "warning",
                title: _t(`Wrong Password`),
            });
            return false;
        }
        return true;
    },

    async clickDiscount() {

         const posPassword = this.pos.config.global_discount_password;
         let result = false
         if (posPassword){
             result = await this.checkPassword(posPassword);
         }
         if (!posPassword || result) {
             super.clickDiscount()
         }
    }
});


