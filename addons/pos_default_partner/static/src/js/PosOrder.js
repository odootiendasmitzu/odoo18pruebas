/** @odoo-module */
import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/store/pos_store";


patch(PosStore.prototype, {
    
    createNewOrder(data = {}) {
        const order = super.createNewOrder(data)
        if(this.config.default_partner){
            order.set_partner(this.config.default_partner.id );
        }

        return order
    }


});
