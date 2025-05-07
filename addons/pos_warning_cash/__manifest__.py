# -*- coding: utf-8 -*-
{
    'name': 'POS Cash Limit',
    'version': '1.1',
    "category": 'Point of Sale',
    'summary': 'To raise warning if outbound cash in pos',
    'description': 'To raise warning if outbound cash in pos',
    'author': 'silvau',
    'website': 'https://zeval.com.mx/',
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_config_view.xml',
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_warning_cash/static/src/js/PaymentScreen.js',
        ],
    },
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}
