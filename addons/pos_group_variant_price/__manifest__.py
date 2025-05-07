# -*- coding: utf-8 -*-
{
    'name': 'POS Group Variant Price',
    'version': '1.1',
    "category": 'Point of Sale',
    'summary': 'Group qty of variants for price computation',
    'description': 'Group qty of variants for price computation',
    'author': 'silvau',
    'website': 'https://zeval.com.mx/',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [
            'pos_group_variant_price/static/src/js/pos_order_line.js',
        ],
    },
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}
