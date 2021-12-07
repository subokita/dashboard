#! /usr/bin/env python
# -*- coding: utf-8 -*-

from plexapi.server          import PlexServer
from plexapi.myplex          import MyPlexAccount
from managers.config_manager import config

class PlexManager( object ):

    def __init__( self, server, client, access_token ):
        super( PlexManager, self ).__init__()

        self._plex        = PlexServer( server, access_token )
        # self._client_name = client
        self._client = next( filter( lambda avail_client: client in avail_client.title, self._plex.clients() ) )
        return


    @property
    def client(self):
        return self._client
        # return next( filter( lambda avail_client: self._client_name in avail_client.title, self._plex.clients() ) )


    async def pause_music( self ):
        self.client.pause( mtype = 'music' )
        return


    async def play_music( self ):
        self.client.play( mtype = 'music' )
        return


    async def next( self ):
        self.client.skipNext( mtype = 'music' )
        return


    async def previous( self ):
        self.client.skipPrevious( mtype = 'music' )
        return


plex = PlexManager( config.plex.server, config.plex.client, config.plex.access_token )