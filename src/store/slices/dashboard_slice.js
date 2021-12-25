import config          from "../../config.json"
import axios           from 'axios'
import moment          from 'moment';
import { createSlice } from '@reduxjs/toolkit';

export const dashboard_slice = createSlice({
    name        : 'dashboard',

    initialState: {
        selected_tab: 0,
        brightness  : 100.0,
        current_time: moment().toISOString()
    },

    reducers    : {
        change_tab: (state, action) => {
            axios.put( `${config.dashboard.rest.put}/${action.payload}` );
        },

        set_tab: (state, action) => {
            state.selected_tab = action.payload;
        },

        update_current_time: (state, action) => {
            state.current_time = action.payload
        },

        set_brightness: ( state, action ) => {
            state.brightness = action.payload
        }
    }
})

export const { change_tab, set_tab, update_current_time, set_brightness } = dashboard_slice.actions
export default dashboard_slice.reducer