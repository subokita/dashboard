#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import requests
import ujson
import datetime
from dotmap                  import DotMap
from managers.config_manager import config


class GiantBombManager( object ):

    def __init__( self, url, api_key ):
        super( GiantBombManager, self ).__init__()

        self._url     = config.giantbomb.url
        self._headers = { 'User-Agent': config.giantbomb.user_agent }
        return


    def fetch_info( self, game_id ):
        url    = f"{self._url}{game_id}/"
        params = {
            "api_key"   : config.giantbomb.api_key,
            "field_list": "name,developers,original_release_date,image,platforms,publishers,deck,id,genres",
            "format"    : "json",
        }
        response = requests.get( url, headers = self._headers, params = params )
        data = DotMap( response.json()['results'] )
        # data.pprint()

        result = DotMap({
            'id'          : data.id,
            'name'        : data.name,
            'deck'        : data.deck,
            'release_date': data.original_release_date,
            'image'       : data.image.thumb_url,
            'developers'  : [developer.name for developer in data.developers],
            'publishers'  : [publisher.name for publisher in data.publishers],
            'platforms'   : [platform.name for platform in data.platforms],
            'genres'      : [genre.name for genre in data.genres],
        })
        # result.pprint()

        return result


giantbomb = GiantBombManager( config.giantbomb.url, config.giantbomb.api_key )
# giantbomb.fetch_info( '3030-39503' )
