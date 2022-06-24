#! /usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import ujson
from dotmap import DotMap
from subprocess             import check_output

output = '(Connected)' in check_output( "scutil --nc list".split( ' ' ) ).decode( 'utf-8' )


print( output )