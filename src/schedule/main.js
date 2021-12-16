import "../index.css"
import "./schedule.css"
import moment                           from 'moment'
import axios                            from 'axios'
import config                           from "../config.json"
import React                            from 'react';
import { Paper, Grid, Box }             from '@mui/material';
import CheckBoxOutlineBlankRoundedIcon  from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon              from '@mui/icons-material/CheckBoxRounded';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';


class SchedulePanel extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            habits: {},
        }

        this.timer = null;
    }


    fetchHabits = () => {
        const data = {
            headers: { AUTHORIZATION: config.schedule.habitify.api_key },
            params : { target_date : moment().set( 'hour', 9 ).format() }
        }

        axios.get( config.schedule.habitify.url, data )
            .then( (response) => {
                let entries = response.data.data;
                let habits  = {};

                for ( var index in entries ) {
                    let entry = entries[index];
                    let area  = entry.area.name;

                    if ( !habits.hasOwnProperty( area) )
                        habits[area] = [];

                    habits[area].push({
                        id      : entry.id,
                        name    : entry.name,
                        status  : entry.status,
                        priority: entry.priority,
                        progress: entry.hasOwnProperty( 'progress' ) ? entry.progress : null
                    })
                }

                Object.values( habits ).forEach( area => {
                    area.sort( (a, b) => (a.priority - b.priority) );
                });

                this.setState({
                    habits: habits
                });
            })

    }

    componentDidMount() {
        // this.fetchHabits();
        this.timer = setInterval( this.fetchHabits, config.schedule.habitify.poll_interval );
    }

    componentWillUnmount() {
        clearInterval( this.timer );
    }

    renderItems( key ) {
        const { habits } = this.state;

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


export default SchedulePanel;