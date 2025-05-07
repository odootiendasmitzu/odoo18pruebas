# -*- coding: utf-8 -*-
from odoo import models, fields


class PosConfig(models.Model):
    _inherit = 'pos.config'


    default_partner = fields.Many2one('res.partner', string="Cliente por default")

