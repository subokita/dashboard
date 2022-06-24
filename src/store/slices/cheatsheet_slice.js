import { createSlice } from '@reduxjs/toolkit';

export const cheatsheet_slice = createSlice({
    name        : 'cheatsheet',
    initialState: {
        selected: null,
        markdown: null
    },

    reducers    : {
        set_selected: (state, action) => {
            state.selected = action.payload
        },

        set_markdown: (state, action) => {
            state.markdown = action.payload
        }
    }
})

export const { set_selected, set_markdown } = cheatsheet_slice.actions
export default cheatsheet_slice.reducer