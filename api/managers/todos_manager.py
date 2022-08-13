#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import things
import ujson
from subprocess              import call
from datetime                import datetime
from managers.config_manager import config


# import os
# import ujson
# from dotmap import DotMap

# with open( "./config.json", 'r' ) as file_pointer:
#     config = DotMap( ujson.load( file_pointer ) )


class TodosManager( object ):
    def __init__( self, auth_token, habits, checklist ):
        super( TodosManager, self ).__init__()
        self._auth_token         = auth_token
        self._habits_uuid        = habits
        self._habit_headings     = self.get_headings( project = habits )
        self._headings           = self.get_headings()
        self._projects           = self.get_projects()
        self._checklist_headings = self.get_headings( project = checklist )
        return


    def get_projects( self, area: str = None ):
        return {
            k: v
            for d in [
                { x['uuid']: x['title'] } for x in things.projects( area = area )
            ]
            for k, v in d.items()
        }


    def get_headings( self, project: str = None ):
        return {
            k: v
            for d in [
                { x['uuid']: x['project'] } for x in things.tasks( type = 'heading', project = project )
            ]
            for k, v in d.items()
        }


    def get_project_by_heading( self, heading ):
        return {
                'project'      : self._headings[heading],
                'project_title': self._projects[self._headings[heading]],
            } if heading in self._headings.keys() else {}


    def today( self ):
        result = []

        for x in things.today( status = 'incomplete', include_items = True):

            heading       = x['heading']       if 'heading' in x else 'null'
            heading_title = x['heading_title'] if 'heading' in x else None

            if heading not in self._habit_headings.keys():
                result.append({
                    'heading'      : heading,
                    'heading_title': heading_title,
                    'status'       : x['status'],
                    'uuid'         : x['uuid'],
                    'created'      : x['created'],
                    'type'         : x['type'],
                    'title'        : x['title'],
                    **self.get_project_by_heading( heading ),
                })
                pass

            continue

        return result



    def habits( self ):
        result = []

        for x in things.today( status = None, include_items = True, last = '1d' ):

            heading       = x['heading']       if 'heading' in x else 'null'
            heading_title = x['heading_title'] if 'heading' in x else None

            if heading in self._habit_headings.keys():
                result.append({
                    'heading'      : heading,
                    'heading_title': heading_title,
                    'status'       : x['status'],
                    'uuid'         : x['uuid'],
                    'created'      : x['created'],
                    'type'         : x['type'],
                    'title'        : x['title'],
                    'checklist'    : [
                        {
                            'title' : y['title'],
                            'type'  : y['type'],
                            'uuid'  : y['uuid'],
                            'status': y['status'],
                        } for y in things.checklist_items( x['uuid'] ) if 'checklist' in x
                    ],
                    **self.get_project_by_heading( heading ),
                })
                pass

            continue

        return result


    def clear_incomplete_habits( self ):
        for x in things.tasks( status = 'incomplete'):
            if 'heading' in x.keys() and x['heading'] in self._habit_headings.keys():
                start_date = datetime.fromisoformat( x['start_date'] )
                if start_date.date() < datetime.today().date():
                    call( ['open', f"things:///update?auth-token={self._auth_token}&id={x['uuid']}&canceled=true" ] )
                pass
            continue
        return




    def checklist( self ):
        result = []

        for x in things.tasks( status = None, include_items = True ):

            heading       = x['heading']       if 'heading' in x else 'null'
            heading_title = x['heading_title'] if 'heading' in x else None

            if heading in self._checklist_headings.keys():
                result.append({
                    'heading'      : heading,
                    'heading_title': heading_title,
                    'status'       : x['status'],
                    'uuid'         : x['uuid'],
                    'created'      : x['created'],
                    'type'         : x['type'],
                    'title'        : x['title'],
                    'checklist'    : [
                        {
                            'title' : y['title'],
                            'type'  : y['type'],
                            'uuid'  : y['uuid'],
                            'status': y['status'],
                        } for y in things.checklist_items( x['uuid'] ) if 'checklist' in x
                    ],
                    **self.get_project_by_heading( heading ),
                })
                pass

            continue

        return result


todos = TodosManager( auth_token = config.todo.auth_token, habits = config.todo.habits, checklist = config.todo.checklist  )
# 'VMv4q3JX63A23XPufgRUQU':
# todos = TodosManager( auth_token = 'LC6NZm8wTfKze3AU9F-m-g', habits = 'QMxEjoTs55MM6VfaFttvx3' )
# from pprint import pprint
# pprint( todos.checklist() )
# pprint( todos.habits() )
# todos.clear_incomplete_habits()