#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import ujson
from sanic                  import Blueprint
from managers.redis_manager import redis_manager
from subprocess             import check_output

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



@device_status.websocket( "/vpn" )
async def get_vpn_status( request, ws ):
    while True:
        output = '(Connected)' in check_output( "scutil --nc list".split( ' ' ) ).decode( 'utf-8' )
        message = str(output)
        await ws.send( message )
        await ws.recv()
        continue
    return

