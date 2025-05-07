/** @odoo-module */
import { patch } from "@web/core/utils/patch";
import { PaymentScreenPaymentLines } from "@point_of_sale/app/screens/payment_screen/payment_lines/payment_lines";

patch(PaymentScreenPaymentLines.prototype, {

       async updateCardNo(paymentline) {
    
       if (paymentline) {
                let value = event.target.value;
                value = value.replaceAll(/[^0-9]/g, '');
                value = value.slice(0,4);
                paymentline.card_no = value;
                event.target.value = value;
       }
    } 
});

