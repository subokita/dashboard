#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
from urllib.parse           import unquote
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager

midi_commander = Blueprint( "midi_commander", url_prefix = "/" )


@midi_commander.websocket( "/exp_pedal" )
async def get_exp_pedal( request, ws ):
    while True:
        message = redis_manager.exp_pedal
        await ws.send( message )
        received = await ws.recv()
        continue
    return



@midi_commander.put( "/exp_pedal/<exp_pedal:int>" )
async def set_exp_pedal( request: Request, exp_pedal: int )  -> HTTPResponse:
    # print( f"exp_pedal: {exp_pedal}" )
    redis_manager.exp_pedal = exp_pedal
    return empty()
