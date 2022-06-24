#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import re
import ujson
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from subprocess             import check_output
from managers.redis_manager import redis_manager

usb_devices = Blueprint( "usb_devices", url_prefix = "/usb" )

async def list_all_connected_usb_devices():
    output         = check_output( "system_profiler SPUSBDataType -json".split( ' ' ) ).decode( 'utf-8' )
    regexp_results = re.findall( r'product_id.*', output, re.MULTILINE )
    return set([ regexp_result[ len( 'product_id" : "' ):len( regexp_result ) - 2 ] for regexp_result in regexp_results ])



async def list_all_connected_bluetooth_devices():
    output    = check_output( "system_profiler SPBluetoothDataType -json".split( ' ' ) ).decode( 'utf-8' )
    devices   = ujson.loads( output )['SPBluetoothDataType'][0]['devices_list']
    connected = []

    for item in devices:
        key = list(item.keys())[0]
        if 'device_connected' in item[key]:
            connected.append( item[key]['device_productID'] )
            pass
        continue

    return set(connected)



@usb_devices.websocket( "/" )
async def get_usb_devices( request, ws ):
    while True:
        usb_devices = redis_manager.usb_devices
        message     = ujson.dumps( usb_devices )
        await ws.send( message )
        received = await ws.recv()
        continue

    return


@usb_devices.put( '/refresh' )
async def device_refresh( request: Request ) -> HTTPResponse:
    redis_manager.usb_devices = await list_all_connected_usb_devices()
    return empty()
