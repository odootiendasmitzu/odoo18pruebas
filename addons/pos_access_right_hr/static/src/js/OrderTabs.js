/** @odoo-module */
import { OrderTabs } from "@point_of_sale/app/components/order_tabs/order_tabs";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";

patch(OrderTabs.prototype, {
    setup() {
        super.setup();
    },

    try_add_order() {
        if (this.disable_add_order()) {
            this.dialog.add(AlertDialog, {
                title: _t("Permisos Necesarios"),
                body: _t("El cajero no tiene permiso para realizar esta operación"),
            });
            return;
        }
        this.newFloatingOrder();
    },

    disable_add_order() {
        if (this.pos.cashier?.disable_add_order) {
            return true;
        } else {
            return false;
        }
    }

});
