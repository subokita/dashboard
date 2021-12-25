import "../index.css"
import "./schedule.css"
import moment                           from 'moment'
import axios                            from 'axios'
import config                           from "../config.json"
import Timer                            from 'tiny-timer'
import React                            from 'react';
import { connect }                      from 'react-redux'
import { set_habits }                   from '../store/slices/schedule_slice.js'
import { Paper, Grid, Box }             from '@mui/material';
import CheckBoxOutlineBlankRoundedIcon  from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon              from '@mui/icons-material/CheckBoxRounded';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';


class SchedulePanel extends React.Component {
    constructor( props ){
        super( props );
        this.timer = new Timer();
    }


    fetchHabits = () => {
        const data = {
            headers: { AUTHORIZATION: config.schedule.habitify.api_key },
            params : { target_date : moment().set( 'hour', 9 ).format() }
        }

        axios.get( config.schedule.habitify.url, data )
            .then( (response) => {
                let entries = response.data.data;
                this.props.dispatch( set_habits( entries ) );
            })
    }

    componentDidMount() {
        this.timer.on( 'tick', (ms) => this.fetchHabits() );
        this.timer.start({ interval: config.schedule.habitify.poll_interval, stopwatch: false })
    }


    componentDidUpdate( prevProps ) {
        if ( this.props.selected_tab === 4 )
            this.timer.resume();
        else
            this.timer.pause();
    }

    componentWillUnmount() {
        this.timer.stop();
    }

    renderItems( key ) {
        const { habits } = this.props;

        var result = [
            <Paper className="paper schedule-habit-area" elevation={0} key={0}>
                {key}
            </Paper>
        ];

        if ( Object.keys( habits ).length > 0 ) {

            if ( habits.hasOwnProperty( key) ) {
                var area = habits[key];

                for( var index in area ) {
                    var entry = area[index];

                    switch( entry.status ) {
                        case 'none':
                            result.push(
                                <Grid container key={entry.id}>
                                    <Grid item xs={2} className="schedule-habit-tick">
                                        <CheckBoxOutlineBlankRoundedIcon className="schedule-tick-pending"/>
                                    </Grid>
                                    <Grid item xs={10} className="schedule-habit-entry schedule-entry-pending">
                                        {entry.name}
                                    </Grid>
                                </Grid>
                            )
                            break;
                        case 'in_progress':
                            if ( entry.progress.current_value === 0 ) {
                                result.push(
                                    <Grid container key={entry.id}>
                                        <Grid item xs={2} className="schedule-habit-tick">
                                            <CheckBoxOutlineBlankRoundedIcon className="schedule-tick-pending"/>
                                        </Grid>
                                        <Grid item xs={7} className="schedule-habit-entry schedule-entry-pending">
                                            {entry.name}
                                        </Grid>
                                        <Grid item xs={3} sx={{ textAlign: 'right' }}  className="schedule-habit-entry schedule-entry-pending">
                                            ({entry.progress.current_value}/{entry.progress.target_value})
                                        </Grid>
                                    </Grid>
                                )
                            }
                            else {
                                result.push(
                                    <Grid container key={entry.id}>
                                        <Grid item xs={2} className="schedule-habit-tick">
                                            <IndeterminateCheckBoxRoundedIcon className="schedule-tick-progress"/>
                                        </Grid>
                                        <Grid item xs={7} className="schedule-habit-entry schedule-entry-progress">
                                            {entry.name}
                                        </Grid>
                                        <Grid item xs={3} sx={{ textAlign: 'right' }}  className="schedule-habit-entry schedule-entry-progress">
                                            ({entry.progress.current_value}/{entry.progress.target_value})
                                        </Grid>
                                    </Grid>
                                )
                            }
                            break;
                        default:
                            result.push(
                                <Grid container key={entry.id}>
                                    <Grid item xs={2} className="schedule-habit-tick">
                                        <CheckBoxRoundedIcon className="schedule-tick-done"/>
                                    </Grid>
                                    <Grid item xs={10} className="schedule-habit-entry schedule-entry-done">
                                        {entry.name}
                                    </Grid>
                                </Grid>

                            )
                            break;

                    }
                }
            }
        }
        return result
    }

    render() {

        return (
            <Box className="box" sx={{ width: Number( this.props.width ) }}>
                <Grid container spacing={1} sx={{ padding: 3 }}>
                    <Grid item xs={3}>
                        {this.renderItems("Languages")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderItems("Exercises")}
                        {this.renderItems("Work")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderItems("Entertainment")}
                        {this.renderItems("Dexterity Skills")}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderItems("Mind")}
                        {this.renderItems("Music")}
                    </Grid>

                </Grid>
            </Box>
        );
    }
}


const mapStateToProps = state => {
    return {
        selected_tab: state.dashboard.selected_tab,
        habits      : state.schedule.habits,
    }
}

export default connect( mapStateToProps )( SchedulePanel );