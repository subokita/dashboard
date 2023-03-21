import moment          from 'moment';
import { createSlice } from '@reduxjs/toolkit';

export const chrono_slice = createSlice({
    name        : 'chrono',

    initialState: {
        status  : 'stopped',
        end_time: moment.unix( 0 ).toISOString(),
    },

    reducers    : {
        set_time_and_status: ( state, action ) => {
            state.status   = action.payload.status;
            state.end_time = action.payload.end_time;
        }
    }
})

export const { set_time_and_status } = chrono_slice.actions
export default chrono_slice.reducer