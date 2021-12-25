import { createSlice } from '@reduxjs/toolkit';

export const device_status_slice = createSlice({
    name        : 'device_status',
    initialState: {
        language         : 'english',
        space            : 'web',
        connected_devices: []
    },

    reducers    : {
        set_device_status: (state, action) => {
            state.space             = action.payload.space.trim().toLowerCase();
            state.language          = action.payload.language.trim().toLowerCase();
            state.connected_devices = action.payload.usb_devices;
        },

        set_space: (state, action) => {
            state.space = action.payload.trim().toLowerCase()
        },

        set_language: (state, action) => {
            state.language = action.payload.trim().toLowerCase()
        },

        set_connected_devices: (state, action) => {
            state.connected_devices = action.payload
        }
    }
})

export const { set_device_status, set_space, set_language, set_connected_devices } = device_status_slice.actions
export default device_status_slice.reducer