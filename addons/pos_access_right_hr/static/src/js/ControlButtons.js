/** @odoo-module */
import { ControlButtons } from "@point_of_sale/app/screens/product_screen/control_buttons/control_buttons";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";

patch(ControlButtons.prototype, {
    setup() {
        super.setup();
    },

    try_delete_order() {
        if (this.disable_delete_order()) {
            this.dialog.add(AlertDialog, {
                title: _t("Permisos Necesarios"),
                body: _t("El cajero no tiene permiso para realizar esta operación"),
            });
            return;
        }
        this.pos.onDeleteOrder(this.pos.get_order());
    },

    disable_delete_order() {
        if (this.pos.cashier?.disable_delete_order) {
            return true;
        } else {
            return false;
        }
    }

});
