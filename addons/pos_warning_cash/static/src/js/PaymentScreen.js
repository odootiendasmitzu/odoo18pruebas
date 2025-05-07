/** @odoo-module */
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";


//Patching ActionpadWidget to disable customer and payment
patch(PaymentScreen.prototype, {
    setup() {
        super.setup();
    },

    async _finalizeValidation() {
        
        await super._finalizeValidation() 

        const info = await this.pos.getClosePosInfo()


        if (this.pos.config.cash_limit != 0 && (this.pos.config.cash_limit < info.default_cash_details.amount )) {
            this.pos.dialog.add(AlertDialog, {
                 title: _t("Aviso"),
                 body: _t("Se ha rebasado el límite de Efectivo en la caja. Se recomienda hacer un retiro de al menos: %s.",(this.env.utils.formatCurrency(info.default_cash_details.amount - this.pos.config.cash_limit))),
             });
        }

   },
});
