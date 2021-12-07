#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os
import ujson
from dotmap import DotMap

with open( "./config.json", 'r' ) as file_pointer:
    config = DotMap( ujson.load( file_pointer ) )
