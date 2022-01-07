#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
from sanic          import Sanic, Blueprint
from sanic_cors     import CORS

from modules.language      import language
from modules.space         import space
from modules.usb_devices   import usb_devices
from modules.tab           import tab
from modules.brightness    import brightness
from modules.now_playing   import now_playing
from modules.game_info     import game_info
from modules.device_status import device_status
from modules.dashboard     import dashboard
from modules.todo          import todo
from modules.dictionary    import dictionary

app = Sanic( "Dashboard" )
blueprint_groups = {
    'device_status': Blueprint.group( language, space, usb_devices, device_status,  url_prefix = '/device_status' ),
    'dashboard'    : Blueprint.group( dashboard, tab, brightness,                   url_prefix = '/dashboard' ),
    'now_playing'  : Blueprint.group( now_playing,                                  url_prefix = '/now_playing' ),
    'game_info'    : Blueprint.group( game_info,                                    url_prefix = '/game_info' ),
    'todo'         : Blueprint.group( todo,                                         url_prefix = '/todo' ),
    'dictionary'   : Blueprint.group( dictionary,                                   url_prefix = '/dictionary' ),
}

for group in blueprint_groups.values():
    app.blueprint( group )

CORS(app)

