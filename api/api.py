#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
from sanic          import Sanic, Blueprint
from sanic_cors     import CORS

from modules.language        import language
from modules.space           import space
from modules.usb_devices     import usb_devices
from modules.tab             import tab
from modules.now_playing     import now_playing


app = Sanic( "Dashboard" )
blueprint_groups = {
    'device_status': Blueprint.group( language, space, usb_devices, url_prefix = '/device_status' ),
    'dashboard'    : Blueprint.group( tab, url_prefix = '/dashboard' ),
    'now_playing'  : Blueprint.group( now_playing, url_prefix = '/now_playing' ),
}

for group in blueprint_groups.values():
    app.blueprint( group )

# CORS(app)

