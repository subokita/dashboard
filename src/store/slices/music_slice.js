import { createSlice } from '@reduxjs/toolkit';
import moment          from 'moment';
import axios           from 'axios'
import config          from "../../config.json"

export const music_slice = createSlice({
    name        : 'music',
    initialState: {
        status     : "",
        artist     : "",
        album      : "",
        year       : "",
        title      : "",
        thumb      : "",
        background : "",
        album_color: null,
    },

    reducers    : {
        set_movie: (state, action) => {
            const directors  = Array.from( action.payload.director, (entry) => (entry.tag) );
            state.status     = action.payload.status;
            state.artist     = directors.join( ', ' );
            state.album      = "";
            state.year       = action.payload.year;
            state.title      = action.payload.title;
            state.thumb      = action.payload.thumb;
            state.background = action.payload.thumb;
        },


        set_episode: (state, action) => {
            state.status     = action.payload.status;
            state.artist     = action.payload.grandparent_title;
            state.album      = "";
            state.year       = moment( action.payload.air_date, 'YYYY-MM-DD' ).format( 'Do MMM YYYY' );
            state.title      = `Season ${action.payload.parent_index} Episode ${action.payload.index}`;
            // state.thumb      = action.payload.thumb;
            // state.background = action.payload.grandparent_thumb;
            state.thumb      = action.payload.grandparent_thumb;
            state.background = action.payload.thumb;
        },


        set_track: (state, action) => {
            const thumbs     = [ action.payload.thumb, action.payload.parent_thumb, action.payload.grandparent_thumb ].filter( (x) => (Object.entries(x).length > 0) );
            state.status     = action.payload.status;
            state.artist     = action.payload.grandparent_title;
            state.album      = action.payload.parent_title;
            state.year       = `(${action.payload.parent_year})`;
            state.title      = action.payload.title;
            state.thumb      = thumbs[0];
            state.background = thumbs[0];
        },

        play_pause: (state) => {
            switch( state.status ) {
                case 'media.play':
                case 'media.resume':
                case 'media.scrobble':
                    axios.put( `${config.now_playing.rest.pause}` );
                    return;
                default:
                    axios.put( `${config.now_playing.rest.play}` );
            }
        },

        previous: ( state ) => {
            axios.put( `${config.now_playing.rest.prev}` );
        },

        next: ( state ) => {

            axios.put( `${config.now_playing.rest.next}` );
        },

    }
})

export const { set_movie, set_episode, set_track, play_pause, previous, next } = music_slice.actions
export default music_slice.reducer