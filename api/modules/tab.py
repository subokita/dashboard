#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
from urllib.parse           import unquote
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager

tab = Blueprint( "tab", url_prefix = "/tab" )


@tab.websocket( "/" )
async def get_selected_tab( request, ws ):
    while True:
        message = redis_manager.selected_tab
        await ws.send( message )
        received = await ws.recv()
        continue
    return



@tab.put( "/<tab:int>" )
async def set_selected_tab( request: Request, tab: int )  -> HTTPResponse:
    print( f"selected tab: {tab}" )
    redis_manager.selected_tab = tab
    return empty()
