import "../index.css"
import "./habit.css"
import config          from "../config.json"
import React           from 'react';
import { connect }     from 'react-redux'
import { set_habits }  from '../store/slices/todo_slice.js'
import { Grid, Box }   from '@mui/material';
import WebSocketHelper from '../common/websocket_helper.js';


class HabitPanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.habits.websocket.url, config.habits.websocket.poll_interval );
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            const info = JSON.parse( event.data );
            this.props.dispatch( set_habits( info ));
        };

        this.ws_helper.start();
    }

    componentDidUpdate( prevProps ) {
        if ( this.props.selected_tab === this.props.index )
            this.ws_helper.resume();
        else
            this.ws_helper.pause();
    }


    renderHabit( habits, key ) {
        var result = [
            <Grid className="habit-area" key={-1}>
                {key}
            </Grid>
        ];

        const selector = {
            class_name: {
                completed : 'habit-entry habit-entry-done',
                canceled : 'habit-entry habit-entry-done',
                incomplete: 'habit-entry habit-entry-pending',
            },
            tick: {
                completed : <span className="habit-tick">🟢 </span>,
                canceled  : <span className="habit-tick">🚸 </span>,
                incomplete: <span className="habit-tick">⭕️ </span>,
            }
        }


        if ( Object.keys( habits ).length > 0 ) {
            if ( habits.hasOwnProperty( key ) ) {
                const area = habits[key];

                for( var index in area ) {
                    var entry = area[index];

                    result.push(
                        <Grid container key={index} className="habit-entry-container">
                            <Grid item xs={12} className={selector.class_name[entry.status]}>
                                { selector.tick[entry.status] }
                                { entry.title }
                            </Grid>
                            <Grid container spacing={0} className="habit-checklist">
                            {
                                entry.checklist.map( (item) => (
                                    <>
                                        <Grid item xs={12} className={selector.class_name[item.status]}>
                                            { selector.tick[item.status] }
                                            {item.title}
                                        </Grid>
                                    </>
                                ))
                            }
                            </Grid>
                        </Grid>
                    );
                }

            }
        }

        return result;
    }


    render() {
        const { selected_tab, index, habits, completion } = this.props;
        if ( selected_tab !== index )
            return (<Box className="box" sx={{ width: Number( this.props.width ) }}/>)

        return (
            <Box className="box" sx={{ width: Number( this.props.width ) }}>
                <Grid container className="habit-container" spacing={1} sx={{ padding: 2 }}>
                    <Grid item xs={3}>
                        {this.renderHabit( habits, "💬 Languages")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderHabit( habits, "🏋️ Exercise")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderHabit( habits, "🖥 Work")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderHabit( habits, "🎬 Streaming")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderHabit( habits, "🍿 Entertainment")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderHabit( habits, "🃏 Dexterity")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderHabit( habits, "🧠 Mind")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderHabit( habits, "🎶 Music")}
                    </Grid>
                    <Grid item xs={3} className="habit-completion">
                        {completion.percentage}<br/>
                        {completion.count}/{completion.total}
                    </Grid>
                </Grid>
            </Box>
        );
    }
}


const mapStateToProps = state => {
    return {
        selected_tab: state.dashboard.selected_tab,
        habits      : state.todo.habits,
        completion  :  state.todo.completion,
    }
}

export default connect( mapStateToProps )( HabitPanel );