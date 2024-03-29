#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import redis
import ujson
import datetime
from dotmap                  import DotMap
from managers.config_manager import config


class RedisManager( object ):

    def __init__( self, host: str, port: int, db: int ):
        super( RedisManager, self ).__init__()
        self._host         = host
        self._port         = port
        self._db           = db
        self._client       = redis.Redis( host = self._host, port = self._port, db = self._db )
        return


    @property
    def cheatsheet( self ) -> str:
        return self._client.get( 'cheatsheet' ).decode( 'utf-8' ).lower()


    @cheatsheet.setter
    def cheatsheet( self, value: str ):
        self._client.set( 'cheatsheet', value.lower() )
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
    def brightness( self ) -> str:
        return self._client.get( 'brightness' ).decode( 'utf-8' )


    @brightness.setter
    def brightness( self, value: float ):
        self._client.set( 'brightness', value )
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
    def bluetooth_devices( self ) -> list:
        return [bluetooth_device.decode( 'utf-8' ) for bluetooth_device in self._client.smembers( 'bluetooth_devices' )]


    @bluetooth_devices.setter
    def bluetooth_devices( self, product_ids ):
        if len( product_ids ) < 1:
            return

        self._client.delete( 'bluetooth_devices' )
        self._client.sadd( 'bluetooth_devices', *product_ids )
        return


    @property
    def now_playing( self ):
        return ujson.loads( self._client.get( 'now_playing' ).decode( 'utf-8' ) )


    @now_playing.setter
    def now_playing( self, payload ):

        self._client.set( 'now_playing', ujson.dumps({
            'status'           : payload.event,
            'year'             : payload.Metadata.year,
            'title'            : payload.Metadata.title,
            'type'             : payload.Metadata.type,
            'thumb'            : payload.Metadata.thumb,
            'index'            : payload.Metadata.index,
            'director'         : [ director.toDict() for director in payload.Metadata.Director ],
            'air_date'         : payload.Metadata.originallyAvailableAt,

            'parent_index'     : payload.Metadata.parentIndex,
            'parent_title'     : payload.Metadata.parentTitle,
            'parent_thumb'     : payload.Metadata.parentThumb,
            'parent_year'      : payload.Metadata.parentYear,
            'grandparent_title': payload.Metadata.grandparentTitle,
            'grandparent_thumb': payload.Metadata.grandparentThumb,
        }))

        return

    @property
    def game_info(self):
        return ujson.loads( self._client.get( 'game_info' ).decode( 'utf-8' ) )


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
    def refresh_time( self ):
        return self._client.get( 'refresh_time' ).decode( 'utf-8' )


    @refresh_time.setter
    def refresh_time( self, value: datetime ):
        self._client.set( 'refresh_time', value )


    @property
    def chrono( self ):
        return ujson.loads( self._client.get( 'chrono' ).decode( 'utf-8' ) )


    @chrono.setter
    def chrono( self, payload ):
        self._client.set( 'chrono', ujson.dumps({
            'end_time': payload.end_time,
            'status'  : payload.status
        }))


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


    @property
    def translation( self ):
        return self._client.get( 'translation' ).decode( 'utf-8' )

    @translation.setter
    def translation( self, payload ):
        self._client.set( 'translation', ujson.dumps( payload ) )



    @property
    def vpn( self ):
        return self._client.get( 'vpn' ).decode( 'utf-8' )

    @vpn.setter
    def vpn( self, payload ):
        self._client.set( 'vpn', ujson.dumps( payload ) )


## TODO: maybe update it to show full TS-Midi display
    @property
    def exp_pedal( self ):
        return self._client.get( 'exp_pedal' ).decode( 'utf-8' )

    @exp_pedal.setter
    def exp_pedal( self, payload ):
        self._client.set( 'exp_pedal', ujson.dumps( payload ) )






redis_manager = RedisManager(
    host = config.redis.host,
    port = config.redis.port,
    db   = config.redis.db
)
