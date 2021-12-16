#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import ujson
from urllib.parse           import unquote
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager
from managers.gb_manager    import giantbomb

game_info = Blueprint( "game_info", url_prefix = "/" )

@game_info.put( "<game_id:str>" )
async def set_game_info( request: Request, game_id: str )  -> HTTPResponse:
    redis_manager.game_info = giantbomb.fetch_info( game_id )

    return empty()


@game_info.websocket( "/" )
async def get_game_info( request, ws ):
    while True:
        message = ujson.dumps( redis_manager.game_info )
        await ws.send( message )
        await ws.recv()
        continue
    return
