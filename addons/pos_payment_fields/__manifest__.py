# -*- coding: utf-8 -*-
{
    'name': 'POS Payment Fields',
    'version': '1.1',
    "category": 'Point of Sale',
    'summary': 'Add card field number on payment',
    'description': 'Add card field number on payment',
    'author': 'silvau',
    'website': 'https://zeval.com.mx/',
    'depends': ['point_of_sale'],
    'data': [
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_payment_fields/static/src/js/payment_lines.js',
            'pos_payment_fields/static/src/xml/payment_lines.xml',
        ],
    },
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}



