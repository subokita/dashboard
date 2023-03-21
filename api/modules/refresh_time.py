#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
from datetime               import datetime
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager

refresh_time = Blueprint( 'refresh_time', url_prefix = "/" )

# @refresh_time.websocket( "/" )
# async def get_refresh_time( request, ws ):
#     while True:
#         message = ujson.dumps( redis_manager.refresh_time )
#         await ws.send( message )
#         await ws.recv()
#         continue
#     return


@refresh_time.put( "<refresh_time:str>" )
async def set_refresh_time( request: Request, refresh_time: str ) -> HTTPResponse:
    redis_manager.refresh_time = refresh_time
    return empty()