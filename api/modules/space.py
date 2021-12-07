#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
from urllib.parse           import unquote
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager

space = Blueprint( "space", url_prefix = "/space" )

@space.put( "<space:str>" )
async def set_space( request: Request, space: str )  -> HTTPResponse:
    redis_manager.space = unquote ( space )
    return empty()


@space.websocket( "/" )
async def get_space( request, ws ):
    while True:
        message = redis_manager.space
        await ws.send( message )
        received = await ws.recv()
        continue
    return

