import { createSlice } from '@reduxjs/toolkit';

export const dictionary_slice = createSlice({
    name        : 'dictionary',
    initialState: {
        dict      : null,
        word      : null,
        definition: null,
        lang      : null,
    },

    reducers    : {
        set_translation: (state, action) => {
            const info       = action.payload;
            state.lang       = info.lang;
            state.dict       = info.dict;
            state.word       = info.word;
            state.definition = info.definition.replace( /<I>/g, '<i>' ).replace( /<\/I>/g, '</i>' );
        },
    }
})

export const { set_translation } = dictionary_slice.actions
export default dictionary_slice.reducer