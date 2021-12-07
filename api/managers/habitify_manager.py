#! /usr/bin/env python
# -*- coding: utf-8 -*-


import os
import requests
import ujson
import datetime
from collections import defaultdict
from managers.config_manager import config

# from dotmap import DotMap
# with open( "./config.json", 'r' ) as file_pointer:
#     config = DotMap( ujson.load( file_pointer ) )


class HabitifyManager( object ):

    def __init__( self, url, api_key ):
        super( HabitifyManager, self ).__init__()

        self._url     = url
        self._headers = {  'AUTHORIZATION': api_key  }
        return


    @classmethod
    def get_utc_time( cls ):
        return datetime.datetime.now().astimezone().replace( microsecond = 0 ).isoformat()


    def fetch_habits( self ):
        params   = { 'target_date': self.get_utc_time() }
        response = requests.get( self._url, headers = self._headers, params = params )
        entries  = response.json()['data']

        result = defaultdict(list)

        for entry in entries:
            area = entry['area']['name']

            result[area].append({
                'id'      : entry['id'],
                'name'    : entry['name'],
                'status'  : entry['status'],
                'priority': int( entry['priority'] ),
                'progress': entry['progress'] if 'progress' in entry else None
            })
            continue


        for areas in result.values():
            sorted( areas, key = lambda item: item['priority']  )
            continue

        return result



habitify = HabitifyManager( config.habitify.url, config.habitify.api_key )