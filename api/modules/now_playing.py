#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import io
import ujson
import asyncio
from urllib.parse            import unquote
from sanic                   import Blueprint
from sanic.response          import HTTPResponse, empty
from sanic.request           import Request
from subprocess              import call
from dotmap                  import DotMap
from colorthief              import ColorThief
from managers.redis_manager  import redis_manager
from managers.config_manager import config
from managers.plex_manager   import plex


now_playing = Blueprint( "now playing", url_prefix = "/" )

@now_playing.websocket( "/info" )
async def info( request: Request, ws ):
    while True:
        message = ujson.dumps({
            **redis_manager.now_playing,
            'album_color': redis_manager.album_color,
        })

        await ws.send( message )
        await ws.recv()
        continue
    return


async def run_yeelight_color_change( color_tuple ):
    rgb = '{:02X}{:02X}{:02X}'.format(*color_tuple)
    call( ['observe.sh', rgb], cwd = config.yeelight_plex.cwd )
    return


@now_playing.route( "/", methods = ['POST'] )
async def handle_plex( request: Request ) -> HTTPResponse:
    payload = DotMap( ujson.loads( request.form['payload'][0] ) )

    if payload.event == 'media.rate':
        return empty()

    # if "plexamp" not in payload.Player.title:
    #     return empty()

    print( f"{payload.event}" )

    if payload.event in ['media.play', 'media.resume', 'media.scrobble' ]:
        if request.files:
            album_art   = request.files['thumb'][0].body
            bytes_io    = io.BytesIO( album_art )
            color_thief = ColorThief( bytes_io )

            palette     = color_thief.get_palette( color_count = 4, quality = 5 )
            rgb_palette = [ f'#{component[0]:02X}{component[1]:02X}{component[2]:02X}' for component in palette ]
            redis_manager.album_color = rgb_palette

            asyncio.ensure_future( run_yeelight_color_change( palette[0] ) )
            pass

        payload.pprint()
        pass

    redis_manager.now_playing = payload

    return empty()



@now_playing.put( "/play" )
async def play( request: Request )  -> HTTPResponse:
    print( 'Playing music' )
    asyncio.ensure_future( plex.play_music() )
    return empty()


@now_playing.put( "/pause" )
async def pause( request: Request )  -> HTTPResponse:
    print( 'Pausing music' )
    asyncio.ensure_future( plex.pause_music() )
    return empty()



@now_playing.put( "/next" )
async def next( request: Request )  -> HTTPResponse:
    asyncio.ensure_future( plex.next() )
    return empty()


@now_playing.put( "/prev" )
async def prev( request: Request )  -> HTTPResponse:
    asyncio.ensure_future( plex.previous() )
    return empty()