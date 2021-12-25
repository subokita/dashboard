#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import ujson
from sanic                  import Blueprint
from managers.redis_manager import redis_manager

device_status = Blueprint( "device_status" )

@device_status.websocket( "/" )
async def get_device_status( request, ws ):
    while True:
        language    = redis_manager.language
        space       = redis_manager.space
        usb_devices = redis_manager.usb_devices
        message     = ujson.dumps({
            'usb_devices': usb_devices,
            'language'   : language,
            'space'      : space,
        })
        await ws.send( message )
        await ws.recv()
        continue
    return
