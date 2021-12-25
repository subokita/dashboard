#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import ujson
from sanic                  import Blueprint
from managers.redis_manager import redis_manager

dashboard = Blueprint( "dashboard" )

@dashboard.websocket( "/" )
async def get_dashboard( request, ws ):
    while True:
        selected_tab = redis_manager.selected_tab
        brightness   = redis_manager.brightness
        message      = ujson.dumps({
            'selected_tab': selected_tab,
            'brightness'  : brightness,
        })
        await ws.send( message )
        await ws.recv()
        continue
    return
