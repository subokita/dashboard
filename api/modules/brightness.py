#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
from urllib.parse           import unquote
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager

brightness = Blueprint( "brightness", url_prefix = "/brightness" )


@brightness.websocket( "/" )
async def get_brightness( request, ws ):
    while True:
        message = redis_manager.brightness
        await ws.send( message )
        received = await ws.recv()
        continue
    return



@brightness.put( "/<brightness:float>" )
async def set_brightness( request: Request, brightness: float )  -> HTTPResponse:
    print( f"brightness: {brightness}" )
    redis_manager.brightness = brightness
    return empty()
