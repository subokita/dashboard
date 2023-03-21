import { configureStore }   from '@reduxjs/toolkit'
import dashboardReducer     from './slices/dashboard_slice.js'
import deviceStatusReducer  from './slices/device_status_slice.js'
import musicReducer         from './slices/music_slice.js'
import gameReducer          from './slices/game_slice.js'
import todoReducer          from './slices/todo_slice.js'
import twitchReducer        from './slices/twitch_slice.js'
import dictionaryReducer    from './slices/dictionary_slice.js'
import cheatsheetReducer    from './slices/cheatsheet_slice.js'
import midiCommanderReducer from './slices/midi_commander_slice.js'
import noteReducer          from './slices/note_slice.js'
import chronoReducer        from './slices/chrono_slice.js'

export default configureStore({
    reducer: {
        dashboard     : dashboardReducer,
        device_status : deviceStatusReducer,
        music         : musicReducer,
        game          : gameReducer,
        twitch        : twitchReducer,
        todo          : todoReducer,
        dictionary    : dictionaryReducer,
        cheatsheet    : cheatsheetReducer,
        midi_commander: midiCommanderReducer,
        note          : noteReducer,
        chrono        : chronoReducer,
    },
})