import config          from "../../config.json"
import axios           from 'axios'
import moment          from 'moment';
import { createSlice } from '@reduxjs/toolkit';

export const dashboard_slice = createSlice({
    name        : 'dashboard',

    initialState: {
        selected_tab     : 0,
        brightness       : 100.0,
        current_time     : moment().toISOString(),
        snackbar_messages: [],
        vpn_status       : false,
    },

    reducers    : {
        change_tab: (state, action) => {
            axios.put( `${config.dashboard.rest.put}/${action.payload}` );
        },

        set_tab: (state, action) => {
            state.selected_tab = action.payload;
        },

        update_current_time: (state, action) => {
            state.current_time = moment().toISOString()
        },

        set_brightness: ( state, action ) => {
            state.brightness = action.payload
        },

        close_snackbar: (state) => {
            state.snackbar_messages = state.snackbar_messages.slice(1);
        },

        notify: ( state, action ) => {
            const data = action.payload

            state.snackbar_messages = [
                ...state.snackbar_messages,
                {
                    key    : moment().toISOString(),
                    message: `${data[0]} ${data[1].replace(/^\w/, c => c.toUpperCase())}`
                }
            ];
        },

        set_vpn_status: ( state, action ) => {
            state.vpn_status = action.payload.trim().toLowerCase() === 'true';
        },
    }
})

export const { change_tab, set_tab, update_current_time,
               set_brightness, close_snackbar, notify, set_vpn_status } = dashboard_slice.actions
export default dashboard_slice.reducer