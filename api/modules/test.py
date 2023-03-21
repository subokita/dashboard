#! /usr/bin/env python
# -*- coding   : utf-8 -*-
import os
import re
import ujson
from dotmap     import DotMap
from subprocess import check_output
from datetime   import datetime, timedelta


# output = '(Connected)' in check_output( "scutil --nc list".split( ' ' ) ).decode( 'utf-8' )


# print( output )
refresh_delta = timedelta( seconds = 10 )
now           = datetime.utcnow()
refresh_time  = now + refresh_delta


print( now )
print( refresh_time )

now_str          = now.isoformat()
refresh_time_str = refresh_time.isoformat()

print( now_str )
print( refresh_time_str )

now_reconstituted          = datetime.fromisoformat( now_str )
refresh_time_reconstituted = datetime.fromisoformat( refresh_time_str )


print( now_reconstituted )
print( refresh_time_reconstituted )


print( ['DONE'] )