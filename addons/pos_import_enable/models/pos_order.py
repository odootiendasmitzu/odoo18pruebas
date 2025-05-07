from odoo import models, api
import re

class PosOrder(models.Model):
    _inherit = 'pos.order'
    _description = 'Habilita la creación de pedidos en el POS para un grupo específico'

    @api.model
    @api.readonly
    def get_views(self, views, options=None):
        """
        Sobrescribe el método get_views para modificar dinámicamente la vista de lista
        de pos.order basada en los grupos del usuario.
        """
        res = super(PosOrder, self).get_views(views, options=options)

        # Verificar si el usuario pertenece al grupo específico
        if self.env.user.has_group('pos_import_enable.group_import_pos_order'):
            # Iterar sobre las vistas obtenidas
            for view in res['views']:
                # Modificar la arquitectura de la vista si es de tipo 'list'
                if view == 'list':
                    # Habilitar el atributo create del elemento list
                    if '<list' in res['views'][view]['arch']:
                        # Buscar y reemplazar create="0", create="1" o create="false"
                        res['views'][view]['arch'] = re.sub(r'<list(.*?)create="(0|1|false)"(.*?)>', r'<list\1create="true"\3>', res['views'][view]['arch'])
                        # Si no existe create="true", agregar create="true"
                        if 'create="true"' not in res['views'][view]['arch']:
                            res['views'][view]['arch'] = res['views'][view]['arch'].replace('<list', '<list create="true"')

        return res
