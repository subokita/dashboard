import { createSlice } from '@reduxjs/toolkit';

export const todo_slice = createSlice({
    name        : 'todo',
    initialState: {
        today : {},
        habits: {},
        completion: {
            total     : 0,
            count     : 0,
            percentage: 0.0,
        }
    },


    reducers    : {
        set_habits: ( state, action ) => {
            let headings = {};
            let completion_count = 0;
            let total_completion = 0;

            action.payload.forEach( (entry) => {
                const heading_name = entry.heading_title ?? "null";
                (headings[heading_name] = headings[heading_name] || []).push( entry );

                completion_count += entry.checklist.filter( (item) => ( item.status === 'completed' )).length;
                total_completion += entry.checklist.length;

                if (entry.checklist.length === 0 ) {
                    total_completion++;
                    if (entry.status === 'completed')
                        completion_count++;
                }
            });

            state.completion.total      = total_completion;
            state.completion.count      = completion_count;
            state.completion.percentage = ( completion_count * 100 / total_completion ).toFixed(1) + '%';
            state.habits                = headings;
        },

        set_today: (state, action) => {
            let projects = {};

            action.payload.forEach( (entry) => {
                const project_name      = entry.project_title ?? "null";
                const heading_name      = entry.heading_title ?? "null";
                const project           = projects[project_name] ?? {};
                ( project[heading_name] = project[heading_name] || [] ).push( entry );
                projects[project_name]  = project;
            });

            state.today = projects;
        },
    }
})

export const { set_habits, set_today } = todo_slice.actions
export default todo_slice.reducer