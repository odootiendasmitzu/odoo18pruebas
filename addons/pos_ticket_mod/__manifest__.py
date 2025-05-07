# -*- coding: utf-8 -*-
{
    'name': 'POS Ticket Mod',
    'version': '1.1',
    "category": 'Point of Sale',
    'summary': 'Ticket Mod',
    'description': '''
       * Descripción de Ventas de los productos en el ticket
    ''',
    'author': 'silvau',
    'website': 'https://zeval.com.mx/',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_ticket_mod/static/src/js/*.*',
        ],
    },
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}
