#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import ujson
import unicodedata
from urllib.parse           import unquote
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.redis_manager import redis_manager
from subprocess              import call, check_output
from managers.config_manager import config


dictionary = Blueprint( "dictionary", url_prefix = "/" )


@dictionary.websocket( "/" )
async def get_translation( request, ws ):
    while True:
        message = redis_manager.translation
        await ws.send( message )
        received = await ws.recv()
        continue
    return



@dictionary.put( "/" )
async def translate( request: Request )  -> HTTPResponse:
    lang   = config.sdcv.languages[request.json['lang']]
    word   = unicodedata.normalize( 'NFC', request.json['word'] )
    result = check_output( ['sdcv', '-j', '-n', '-0', '-1', '-u', lang, '-2', config.sdcv.dictionaries_location, word] )
    result = ujson.loads( result.decode( 'utf-8' ) )
    print( result[0] )

    redis_manager.translation = { **result[0], 'lang': request.json['lang'] }
    return empty()
