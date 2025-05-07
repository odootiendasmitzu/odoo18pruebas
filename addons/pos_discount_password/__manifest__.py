# -*- coding: utf-8 -*-
{
    'name': 'POS Discount Password',
    'version': '1.1',
    "category": 'Point of Sale',
    'summary': 'To require password before apply discount',
    'discount': 'To require password before apply discount',
    'author': 'silvau',
    'website': 'https://zeval.com.mx/',
    'depends': ['point_of_sale', 'pos_discount'],
    'data': [
        'views/pos_config_view.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_discount_password/static/src/js/pos_discount_password.js',
            'pos_discount_password/static/src/xml/pos_discount_password.xml',
        ],
    },
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}



