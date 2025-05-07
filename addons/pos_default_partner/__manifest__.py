# -*- coding: utf-8 -*-
{
    'name': 'POS Default Partner',
    'version': '1.1',
    "category": 'Point of Sale',
    'summary': 'Set default partner on pos order',
    'description': 'Set default partner on pos order',
    'author': 'silvau',
    'website': 'https://zeval.com.mx/',
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_config_view.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_default_partner/static/src/js/PosOrder.js',
        ],
    },
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}
