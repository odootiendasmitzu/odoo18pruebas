# -*- coding: utf-8 -*-
from odoo import models, fields


class PosConfig(models.Model):
    _inherit = 'pos.config'


    cash_limit = fields.Float(string="Limite de efectivo para lanzar warning")


