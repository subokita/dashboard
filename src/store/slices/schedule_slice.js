import { createSlice } from '@reduxjs/toolkit';

export const schedule_slice = createSlice({
    name        : 'schedule',
    initialState: {
        habits: {}
    },

    reducers    : {
        set_habits: (state, action) => {
            let entries = action.payload;
            let habits  = {};

            for ( var index in entries ) {
                let entry = entries[index];
                let area  = entry.area.name;

                if ( !habits.hasOwnProperty( area) )
                    habits[area] = [];

                habits[area].push({
                    ...entry,
                    progress: entry.hasOwnProperty( 'progress' ) ? entry.progress : null
                })
            }

            Object.values( habits ).forEach( area => {
                area.sort( (a, b) => (a.priority - b.priority) );
            });

            state.habits = habits;
        },
    }
})

export const { set_habits } = schedule_slice.actions
export default schedule_slice.reducer