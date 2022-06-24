#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
from urllib.parse           import unquote
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager

cheatsheet = Blueprint( "cheatsheet", url_prefix = "/" )

@cheatsheet.put( "<cheatsheet:str>" )
async def set_cheatsheet( request: Request, cheatsheet: str )  -> HTTPResponse:
    redis_manager.cheatsheet = unquote( cheatsheet )
    return empty()


@cheatsheet.websocket( "/" )
async def get_cheatsheet( request, ws ):
    while True:
        message = redis_manager.cheatsheet
        await ws.send( message )
        await ws.recv()
        continue
    return
