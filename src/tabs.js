import './index.css';
import tabs              from "./tabs.json"
import React             from 'react';
import { Avatar }        from '@mui/material';

import DeviceStatusPanel from './device-status/main.js'
import TimePanel         from './time/main.js'
import MusicPanel        from './music/main.js'
import HabitPanel        from './habit/main.js'
import TwitchPanel       from './twitch/main.js'
import GamePanel         from './game/main.js'
import TodoPanel         from './todo/main.js'
import DictionaryPanel   from './dictionary/main.js'

import CzechPanel        from './cheatsheet/czech.js'
import HebrewPanel       from './cheatsheet/hebrew.js'
import SwahiliPanel      from './cheatsheet/swahili.js'

var index = 0;
const uid_panel_mappings = {
    time         : <TimePanel         key={index} index={index++}/>,
    device_status: <DeviceStatusPanel key={index} index={index++}/>,
    music        : <MusicPanel        key={index} index={index++}/>,
    habits       : <HabitPanel        key={index} index={index++} width={1150}/>,
    todo         : <TodoPanel         key={index} index={index++} width={1150}/>,
    game         : <GamePanel         key={index} index={index++}/>,
    twitch       : <TwitchPanel       key={index} index={index++}/>,
    dictionary   : <DictionaryPanel   key={index} index={index++}/>,
    czech        : <CzechPanel        key={index} index={index++}/>,
    hebrew       : <HebrewPanel       key={index} index={index++}/>,
    russian      : <div               key={index} index={index++}/>,
    korean       : <div               key={index} index={index++}/>,
    swedish      : <div               key={index} index={index++}/>,
    swahili      : <SwahiliPanel      key={index} index={index++}/>,
    turkish      : <div               key={index} index={index++}/>,
}

let tab_mappings = [];

tabs.items.forEach( (item) => {
    tab_mappings.push({
        icon : <Avatar className="tabs-avatar" src={item.icon.path.replace( '~/dashboard/public/', '' )}/>,
        panel: uid_panel_mappings[item.uid]
    });
});

export default tab_mappings;