#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
from urllib.parse           import unquote
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager

language = Blueprint( "language", url_prefix = "/language" )


@language.put( "<language:str>" )
async def set_language( request: Request, language: str )  -> HTTPResponse:
    redis_manager.language = unquote( language )
    return empty()


@language.websocket( "/" )
async def get_language( request, ws ):
    while True:
        message = redis_manager.language
        await ws.send( message )
        await ws.recv()
        continue
    return
