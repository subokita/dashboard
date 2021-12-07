import "../index.css"
import "./device-status.css"
import React               from 'react';
import moment              from 'moment'
import { Box, Grid, Paper} from '@mui/material';
import config              from "../config.json"

class Clock extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            start_time  : moment(),
            current_time: moment()
        }
    }

    componentDidMount() {
        this.timer_ID = setInterval( () => this.tick(), 1000 );
    }

    componentWillUnmount() {
        clearInterval( this.timer_ID );
    }

    tick() {
        this.setState({ current_time: moment() });
    }

    render() {
        const time_format = this.state.current_time.seconds() % 2 ? 'HH:mm' : 'HH mm'

        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid container spacing={0} sx={{ padding: 1 }}>
                    <Grid item xs={12}>
                        <Paper className="paper device-status-date" elevation={0} sx={{ textAlign: 'right', fontSize: '23px', letterSpacing: '2px'}}>
                            {this.state.current_time.utcOffset( config.time.local.utc * 60 ).format( 'ddd, MMM DD YYYY' )}
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper className="paper device-status-local device-status-clock" elevation={0}>
                            {config.time.local.city}
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className="paper device-status-local device-status-clock" elevation={0}>
                            {this.state.current_time.utcOffset( config.time.local.utc * 60 ).format( time_format )}
                        </Paper>
                    </Grid>
                    {
                        config.time.world.map( (entry, index) => (
                            <Grid container key={index}>
                                <Grid item xs={8}>
                                    <Paper className="paper device-status-clock" elevation={0}>
                                        {entry.city}
                                    </Paper>
                                </Grid>
                                <Grid item xs={4}>
                                    <Paper className="paper device-status-clock" elevation={0}>
                                        {this.state.current_time.utcOffset( entry.utc * 60 ).format( time_format )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        );
    }
}

export default Clock;