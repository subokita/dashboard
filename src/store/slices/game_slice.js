import { createSlice } from '@reduxjs/toolkit';
import moment          from 'moment';

export const game_slice = createSlice({
    name        : 'game',
    initialState: {
        image       : null,
        name        : null,
        release_date: null,
        developers  : null,
        platforms   : null,
        deck        : null,
        genres      : null,
    },

    reducers    : {
        set_info: (state, action) => {
            const info = action.payload;
            state.image        = info.image;
            state.name         = info.name;
            state.release_date = info.release_date ? moment( info.release_date, 'YYYY-MM-DD' ).format( 'MMM DD, YYYY' ) : "???";
            state.developers   = info.developers.join(', ');
            state.platforms    = info.platforms.join(', ');
            state.deck         = info.deck;
            state.genres       = info.genres.join(', ');
        },
    }
})

export const { set_info } = game_slice.actions
export default game_slice.reducer