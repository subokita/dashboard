import { createSlice } from '@reduxjs/toolkit';
import moment          from 'moment';

export const midi_commander_slice = createSlice({
    name        : 'midi_commander',
    initialState: {
        exp_pedal: null,
    },

    reducers    : {
        set_exp_pedal: (state, action) => {
            state.exp_pedal = action.payload;
        },
    }
})

export const { set_exp_pedal } = midi_commander_slice.actions
export default midi_commander_slice.reducer