# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).

from odoo import fields, models, api
from odoo.tools import frozendict

class AccountAnalyticDistributionModel(models.Model):
    _inherit = "account.analytic.distribution.model"
    
    sales_team_id = fields.Many2one('crm.team', string='Equipo de Ventas')
    warehouse_id = fields.Many2one('stock.warehouse', string='Almacén')


class SaleOrderLine(models.Model):
    _inherit = "sale.order.line"


    @api.depends('order_id.partner_id', 'product_id','order_id.team_id','order_id.warehouse_id')
    def _compute_analytic_distribution(self):
        for line in self:
            if not line.display_type:
                distribution = line.env['account.analytic.distribution.model']._get_distribution({
                    "product_id": line.product_id.id,
                    "product_categ_id": line.product_id.categ_id.id,
                    "partner_id": line.order_id.partner_id.id,
                    "partner_category_id": line.order_id.partner_id.category_id.ids,
                    "company_id": line.company_id.id,
                    "sales_team_id": line.order_id.team_id.id,
                    "warehouse_id": line.order_id.warehouse_id.id,
                })
                line.analytic_distribution = distribution or line.analytic_distribution

   
class AccountMoveLine(models.Model):
    _inherit = "account.move.line"

    sales_team_id = fields.Many2one('crm.team', string='Equipo de Ventas', compute="compute_sale_fields")
    warehouse_id = fields.Many2one('stock.warehouse', string='Almacén', compute="compute_sale_fields")

    @api.depends('sale_line_ids','move_id','move_id.stock_move_id','move_id.stock_move_id.picking_id','move_id.pos_order_ids')
    def compute_sale_fields(self):
        for record in self:
            record.sales_team_id = False
            record.warehouse_id = False
            sales = record.sale_line_ids.mapped('order_id')
            if sales: # Existe una venta relacionada
                sale_id =sales[0]
                record.sales_team_id = sale_id.team_id
                record.warehouse_id = sale_id.warehouse_id
                continue
            picking_id = record.move_id.stock_move_id.picking_id
            if not picking_id:
                picking_id = self.env['stock.picking'].search([('name','=',record.move_id.stock_move_id.name)])
            if picking_id:
                sale_id = picking_id.sale_id
                if sale_id: # Existe una venta relacionada
                    record.sales_team_id = sale_id.team_id
                    record.warehouse_id = sale_id.warehouse_id
                    continue
                pos_order_id = picking_id.pos_order_id
                if pos_order_id: # Existe una venta relacionada
                    record.sales_team_id = pos_order_id.config_id.crm_team_id
                    record.warehouse_id = pos_order_id.config_id.warehouse_id or pos_order_id.config_id.picking_type_id.warehouse_id
                    continue

            pos_order_id = self.env['pos.order'].search([('account_move','=',record.move_id.id)])
            if not pos_order_id:
                pos_order_id = self.env['pos.order'].search([('name','=',record.move_id.invoice_origin)])
            if not pos_order_id:
                pos_order_id = self.env['pos.order'].search([('name','=',record.move_id.stock_move_id.name)])
            if pos_order_id: # Existe una orden del punto de venta asociada 
                record.sales_team_id = pos_order_id.config_id.crm_team_id
                record.warehouse_id = pos_order_id.config_id.warehouse_id or pos_order_id.config_id.picking_type_id.warehouse_id
                continue

    @api.depends('account_id', 'partner_id', 'product_id', 'sale_line_ids','move_id','move_id.stock_move_id','move_id.stock_move_id.picking_id')
    def _compute_analytic_distribution(self):
        cache = {}
        for line in self:
            if line.display_type == 'product' or not line.move_id.is_invoice(include_receipts=True):
                arguments = frozendict({
                    "product_id": line.product_id.id,
                    "product_categ_id": line.product_id.categ_id.id,
                    "partner_id": line.partner_id.id,
                    "partner_category_id": line.partner_id.category_id.ids,
                    "account_prefix": line.account_id.code,
                    "company_id": line.company_id.id,
                    "sales_team_id": line.sales_team_id.id,
                    "warehouse_id": line.warehouse_id.id,
                })
                if arguments not in cache:
                    cache[arguments] = self.env['account.analytic.distribution.model']._get_distribution(arguments)
                line.analytic_distribution = cache[arguments] or line.analytic_distribution

