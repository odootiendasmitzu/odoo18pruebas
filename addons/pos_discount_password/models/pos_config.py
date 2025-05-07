# -*- coding: utf-8 -*-
from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
import hashlib


class PosConfig(models.Model):
    _inherit = 'pos.config'


    global_discount_password = fields.Char(string='Contraseña de Descuento Global')


    def _load_pos_data(self, data):
        res = super()._load_pos_data(data)

        res['data'][0]['global_discount_password'] = hashlib.sha1(res['data'][0]['global_discount_password'].encode('utf8')).hexdigest() if res['data'][0]['global_discount_password'] else False
        return res

    @api.constrains('global_discount_password')
    def _verify_global_discount_password(self):
        for config in self:
            if config.global_discount_password and not config.global_discount_password.isdigit():
                raise ValidationError(_("El password deben ser dígitos"))




