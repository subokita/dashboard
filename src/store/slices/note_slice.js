import { createSlice } from '@reduxjs/toolkit';

export const note_slice = createSlice({
    name        : 'note',
    initialState: {
        selected: null,
        column_1: null,
        column_2: null,
        column_3: null
    },

    reducers    : {
        set_column_1: (state, action) => {
            state.column_1 = action.payload
        },


        set_column_2: (state, action) => {
            state.column_2 = action.payload
        },


        set_column_3: (state, action) => {
            state.column_3 = action.payload
        }
    }
})

export const { set_column_1, set_column_2, set_column_3 } = note_slice.actions
export default note_slice.reducer