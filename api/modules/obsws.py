#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os

from urllib.parse           import unquote
from sanic                  import Blueprint
from sanic.response         import HTTPResponse, empty
from sanic.request          import Request
from managers.obsws_manager import obsws_manager

obsws = Blueprint( "obsws", url_prefix = "/" )

@obsws.put( "/scene/<scene:str>" )
async def set_scene( request: Request, scene: str )  -> HTTPResponse:
    obsws_manager.set_scene(  unquote( scene ) )
    return empty()


@obsws.put( "/main_view/<main_view:str>" )
async def set_main_view( request: Request, main_view: str )  -> HTTPResponse:
    obsws_manager.set_main_view( unquote( main_view ) )
    return empty()


@obsws.put( "/side_widget/<side_widget:str>" )
async def set_side_widget( request: Request, side_widget: str )  -> HTTPResponse:
    obsws_manager.set_side_widget( unquote( side_widget ) )
    return empty()


@obsws.put( "/toggle/now_playing" )
async def toggle_now_playing( request: Request )  -> HTTPResponse:
    obsws_manager.toggle_now_playing()
    return empty()


@obsws.put( "/toggle/duolingo_bgm" )
async def toggle_duolingo_bgm( request: Request )  -> HTTPResponse:
    obsws_manager.toggle_duolingo_bgm()
    return empty()


@obsws.put( "/toggle/at2020v_monitor" )
async def toggle_at2020v_monitor( request: Request )  -> HTTPResponse:
    obsws_manager.toggle_at2020v_monitor()
    return empty()


@obsws.put( "/toggle/at2020v_vst" )
async def toggle_at2020v_vst( request: Request )  -> HTTPResponse:
    obsws_manager.toggle_at2020v_vst()
    return empty()


@obsws.put( "/toggle/elgato_monitor" )
async def toggle_elgato_monitor( request: Request )  -> HTTPResponse:
    obsws_manager.toggle_elgato_monitor()
    return empty()