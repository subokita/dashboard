#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import ujson
from dotmap                 import DotMap
from datetime               import datetime, timedelta
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager

chrono = Blueprint( "chrono", url_prefix = "/" )


@chrono.websocket( "/" )
async def get_chrono( request, ws ):
    while True:
        message = ujson.dumps( redis_manager.chrono )
        await ws.send( message )
        await ws.recv()
        continue
    return


@chrono.put( "<status:str>" )
async def set_chrono( request: Request, status: str ) -> HTTPResponse:
    time = datetime.now()

    if status.lower() == 'running':
        time = datetime.now() + timedelta( minutes = 25 )
        pass

    elif status.lower() == 'break':
        time = datetime.now() + timedelta( minutes = 5 )
        pass
    elif status.lower() == 'stopped':
        time = datetime.now()
        pass

    redis_manager.chrono =  DotMap({
        'status'  : status.lower(),
        'end_time': time.isoformat()
    })

    return empty()