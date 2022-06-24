#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import ujson
from sanic                  import Blueprint
from sanic.request          import Request
from sanic.response         import HTTPResponse, empty
from managers.todos_manager import todos

todo = Blueprint( "todo" )


@todo.websocket( "/today" )
async def get_today_tasks( request, ws ):
    while True:
        message = ujson.dumps( todos.today() )
        await ws.send( message )
        received = await ws.recv()
        continue
    return



@todo.websocket( "/habits" )
async def get_today_habits( request, ws ):
    while True:
        message = ujson.dumps( todos.habits() )
        await ws.send( message )
        received = await ws.recv()
        continue
    return



@todo.put( "/clear_incomplete_habits" )
async def clear_incomplete_habits( request: Request )  -> HTTPResponse:
    todos.clear_incomplete_habits()
    return empty()
