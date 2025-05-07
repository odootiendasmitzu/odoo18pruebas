/** @odoo-module */
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { CashMovePopup } from "@point_of_sale/app/navbar/cash_move_popup/cash_move_popup";
import { CashMoveReceipt } from "@point_of_sale/app/navbar/cash_move_popup/cash_move_receipt/cash_move_receipt";
import { parseFloat } from "@web/views/fields/parsers";

patch(CashMovePopup.prototype, {



    async confirm() {
        const amount = parseFloat(this.state.amount);
        const formattedAmount = this.env.utils.formatCurrency(amount);
        if (!amount) {
            this.notification.add(_t("Cash in/out of %s is ignored.", formattedAmount));
            return this.props.close();
        }

        const type = this.state.type;
        const translatedType = _t(type);
        const extras = { formattedAmount, translatedType };
        const reason = this.state.reason.trim();

        await this.pos.data.call(
            "pos.session",
            "try_cash_in_out",
            this._prepare_try_cash_in_out_payload(type, amount, reason, extras),
            {},
            true
        );
        await this.pos.logEmployeeMessage(
            `${_t("Cash")} ${translatedType} - ${_t("Amount")}: ${formattedAmount}`,
            "CASH_DRAWER_ACTION"
        );
        const receipt_html = await this.printer.renderer.toHtml(CashMoveReceipt, {
            reason,
            translatedType,
            formattedAmount,
            headerData: this.pos.getReceiptHeaderData(),
            date: new Date().toLocaleString(),
        });
        await this.printer.printWeb(receipt_html)
        this.props.close();
        this.notification.add(
            _t("Successfully made a cash %s of %s.", type, formattedAmount),
            3000
        );
    }

});
