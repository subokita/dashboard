#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import redis
import ujson
from dotmap                  import DotMap
from managers.config_manager import config


class RedisManager( object ):

    def __init__( self, host: str, port: int, db: int ):
        super( RedisManager, self ).__init__()
        self._host   = host
        self._port   = port
        self._db     = db
        self._client = redis.Redis( host = self._host, port = self._port, db = self._db )
        return


    @property
    def language( self ) -> str:
        return self._client.get( 'language' ).decode( 'utf-8' ).lower()


    @language.setter
    def language( self, value: str ):
        self._client.set( 'language', value.lower() )
        return


    @property
    def space( self ) -> str:
        return self._client.get( 'space' ).decode( 'utf-8' ).lower()


    @space.setter
    def space( self, value: str ):
        self._client.set( 'space', value.lower() )
        return


    @property
    def selected_tab( self ) -> str:
        return self._client.get( 'selected_tab' ).decode( 'utf-8' )


    @selected_tab.setter
    def selected_tab( self, value: int ):
        self._client.set( 'selected_tab', value )
        return


    @property
    def usb_devices( self ) -> list:
        return [usb_device.decode( 'utf-8' ) for usb_device in self._client.smembers( 'usb_devices' )]


    @usb_devices.setter
    def usb_devices( self, product_ids ):
        self._client.delete( 'usb_devices' )
        self._client.sadd( 'usb_devices', *product_ids )
        return


    @property
    def now_playing( self ):
        return ujson.loads( self._client.get( 'now_playing' ).decode( 'utf-8' ) )


    @now_playing.setter
    def now_playing( self, payload ):
        self._client.set( 'now_playing', ujson.dumps({
            'status': payload.event,
            'artist': payload.Metadata.grandparentTitle,
            'album' : payload.Metadata.parentTitle,
            'year'  : payload.Metadata.parentYear,
            'title' : payload.Metadata.title,
            'thumb' : payload.Metadata.thumb if 'track' in payload.Metadata.type else payload.Metadata.parentThumb,
        }))

        return

    @property
    def game_info(self):
        return ujson.loads( self._client.get( 'game_info').decode( 'utf-8' ) )


    @game_info.setter
    def game_info( self, payload ):
        self._client.set( 'game_info', ujson.dumps({
            'id'          : payload.id,
            'name'        : payload.name,
            'deck'        : payload.deck,
            'release_date': payload.release_date,
            'image'       : payload.image,
            'developers'  : payload.developers,
            'publishers'  : payload.publishers,
            'platforms'   : payload.platforms,
            'genres'      : payload.genres,
        }))

        return




    @property
    def habits( self ):
        return self._client.get( 'habits' ).decode( 'utf-8' )


    @habits.setter
    def habits( self, payload ):
        self._client.set( 'habits', ujson.dumps( payload ) )
        return


    @property
    def album_color( self ):
        return self._client.get( 'album_color' ).decode( 'utf-8' )


    @album_color.setter
    def album_color( self, hls_palette ):
        self._client.set( 'album_color', ujson.dumps( hls_palette ) )
        return



redis_manager = RedisManager(
    host = config.redis.host,
    port = config.redis.port,
    db   = config.redis.db
)
