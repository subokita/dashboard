import './index.css';
import tabs               from "./tabs.json"
import React              from 'react';
import { Avatar }         from '@mui/material';

import DeviceStatusPanel  from './device-status/main.js'
import TimePanel          from './time/main.js'
import MusicPanel         from './music/main.js'
import HabitPanel         from './habit/main.js'
import TwitchPanel        from './twitch/main.js'
import GamePanel          from './game/main.js'
import TodoPanel          from './todo/main.js'
import DictionaryPanel    from './dictionary/main.js'
import CheatsheetPanel    from './cheatsheet/main.js'
import MidiCommanderPanel from './midi_commander/main.js'


var index = 0;
const uid_panel_mappings = {
    time          : <TimePanel          key={index} index={index++}/>,
    device_status : <DeviceStatusPanel  key={index} index={index++}/>,
    music         : <MusicPanel         key={index} index={index++}/>,
    habits        : <HabitPanel         key={index} index={index++} width={1150}/>,
    todo          : <TodoPanel          key={index} index={index++} width={1150}/>,
    game          : <GamePanel          key={index} index={index++}/>,
    twitch        : <TwitchPanel        key={index} index={index++}/>,
    dictionary    : <DictionaryPanel    key={index} index={index++}/>,
    midi_commander: <MidiCommanderPanel key={index} index={index++}/>,
    cheat         : <CheatsheetPanel    key={index} index={index++}/>,
}

let tab_mappings = [];

tabs.items.forEach( (item) => {
    tab_mappings.push({
        icon : <Avatar className="tabs-avatar" src={item.icon.path.replace( '~/dashboard/public/', '' )}/>,
        panel: uid_panel_mappings[item.uid]
    });
});

export default tab_mappings;