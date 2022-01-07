import { configureStore }  from '@reduxjs/toolkit'
import dashboardReducer    from './slices/dashboard_slice.js'
import deviceStatusReducer from './slices/device_status_slice.js'
import musicReducer        from './slices/music_slice.js'
import gameReducer         from './slices/game_slice.js'
import todoReducer         from './slices/todo_slice.js'
import twitchReducer       from './slices/twitch_slice.js'
import dictionaryReducer   from './slices/dictionary_slice.js'

export default configureStore({
    reducer: {
        dashboard    : dashboardReducer,
        device_status: deviceStatusReducer,
        music        : musicReducer,
        game         : gameReducer,
        twitch       : twitchReducer,
        todo         : todoReducer,
        dictionary   : dictionaryReducer,
    },
})