# -*- coding: utf-8 -*-
{
    'name': 'POS Cash Web Print',
    'version': '1.1',
    "category": 'Point of Sale',
    'summary': 'Print using web',
    'description': 'Print using web',
    'author': 'silvau',
    'website': 'https://zeval.com.mx/',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_cash_web_print/static/src/js/cash_move_popup.js',
        ],
    },
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}
