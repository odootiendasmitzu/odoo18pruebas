# -*- coding: utf-8 -*-
{
    'name': "synchronize_v15_v18",

    'summary': """
        Sincroniza los datos de odoo v15 a v18""",

    'description': """
        Sincroniza los datos de odoo v15 a v18
    """,

    'author': "Grupo Comprap",
    'developer': "Gerardo Olguin",
    'website': "http://www.mitzu.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/master/odoo/addons/base/module/module_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.0.0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','product'],

    # always loaded
    'data': [
        'views/product_product.xml',
    ],
    # only loaded in demonstration mode
    # 'demo': [
    #     'demo/demo.xml',
    # ],
    'license': 'AGPL-3',
}
