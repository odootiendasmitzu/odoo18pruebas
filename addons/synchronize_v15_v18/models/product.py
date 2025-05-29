from odoo import models, fields


class Product_product(models.Model):
    _inherit = 'product.product'

    # Add a new field to the product.product model
    template_product = fields.Char(string='Agrupador', store=True)