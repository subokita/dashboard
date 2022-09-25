#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import requests
import ujson
import datetime
import obsws_python as obs
from dotmap                  import DotMap
# from managers.config_manager import config

from pprint import pprint

class OBSWSManager( object ):

    def __init__( self, hostname: str, port: int, password: str ):
        super( OBSWSManager, self ).__init__()


        self._hostname   = hostname
        self._port       = port
        self._password   = password
        self._client     = obs.ReqClient( host = self._hostname, port = self._port, password = self._password )

        return


    def set_scene( self, scene_name: str ):
        self._client.set_current_program_scene( scene_name )
        return


    def set_game_streaming_scene( self ):
        self._client.set_current_program_scene( "Game Streaming" )
        return

    def set_just_chatting_scene( self ):
        self._client.set_current_program_scene( "Just Chatting" )
        return

    def set_intro_scene( self ):
        self._client.set_current_program_scene( "Intro" )
        return

    def set_break_scene( self ):
        self._client.set_current_program_scene( "Break" )
        return

    def set_ending_scene( self ):
        self._client.set_current_program_scene( "Ending" )
        return


    def set_main_view( self, group_name: str ):
        scene_name  = "Main View"
        scene_items = self._client.get_scene_item_list( scene_name )
        main_items  = { group['sourceName'].lower() : group['sceneItemId'] for group in scene_items.scene_items if group['isGroup'] }

        for name, id in main_items.items():
            self._client.set_scene_item_enabled( scene_name, id, False )

        self._client.set_scene_item_enabled( scene_name, main_items[group_name.lower()], True )

        return


    def set_side_widget( self, widget_name: str ):
        group_name   = "Side Widget"
        scene_items  = self._client.get_group_scene_item_list( group_name )
        side_widgets = { group['sourceName'].lower() : group['sceneItemId'] for group in scene_items.scene_items }

        for name, id in side_widgets.items():
            self._client.set_scene_item_enabled( group_name, id, False )

        self._client.set_scene_item_enabled( group_name, side_widgets[widget_name.lower()], True )

        return


    def toggle_now_playing( self ):
        scene_items = self._client.get_scene_item_list( 'Overlays' ).scene_items
        now_playing = DotMap( list(filter( lambda x: x['sourceName'] == 'Now Playing', scene_items ))[0] )
        self._client.set_scene_item_enabled( "Overlays", now_playing.sceneItemId, not now_playing.sceneItemEnabled )
        return



    def toggle_duolingo_bgm( self ):
        scene_items  = self._client.get_group_scene_item_list( 'Window' ).scene_items
        duolingo_bgm = DotMap( list(filter( lambda x: x['sourceName'] == 'Duolingo BGM', scene_items ))[0] )
        self._client.set_scene_item_enabled( "Window", duolingo_bgm.sceneItemId, not duolingo_bgm.sceneItemEnabled )
        return


    def toggle_at2020v_monitor( self ):
        resp = self._client.get_input_audio_monitor_type( 'AT2020V Mic' )

        if resp.monitor_type == 'OBS_MONITORING_TYPE_NONE':
            self._client.set_input_audio_monitor_type( 'AT2020V Mic', 'OBS_MONITORING_TYPE_MONITOR_AND_OUTPUT' )
        else:
            self._client.set_input_audio_monitor_type( 'AT2020V Mic', 'OBS_MONITORING_TYPE_NONE' )

        return


    def toggle_at2020v_vst( self ):
        resp = self._client.get_source_filter( 'AT2020V Mic', "VST 2.x Plug-in" )
        self._client.set_source_filter_enabled( 'AT2020V Mic', "VST 2.x Plug-in", not resp.filter_enabled )
        return



obsws_manager = OBSWSManager( '192.168.1.102', 4444, 'zr7pyFXyY0fs3Cqt' )

