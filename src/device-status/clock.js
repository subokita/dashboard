import "../index.css"
import "./device-status.css"
import React         from 'react';
import moment        from 'moment'
import { Box, Grid } from '@mui/material';
import config        from "../config.json"

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
        const { current_time } = this.state;
        const time_format = current_time.seconds() % 2 ? 'HH:mm' : 'HH mm'

        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid container spacing={0} sx={{ padding: 1 }}>
                    <Grid item xs={12} className="paper device-status-date">
                        {current_time.utcOffset( config.time.local.utc * 60 ).format( 'ddd, MMM DD YYYY' )}
                    </Grid>
                    <Grid item xs={8} className="paper device-status-local device-status-clock">
                        {config.time.local.city}
                    </Grid>
                    <Grid item xs={4} className="paper device-status-local device-status-clock">
                        {current_time.utcOffset( config.time.local.utc * 60 ).format( time_format )}
                    </Grid>
                    {
                        config.time.world.map( (entry, index) => (
                            <Grid container key={index}>
                                <Grid item xs={8} className="paper device-status-clock">
                                    {entry.city}
                                </Grid>
                                <Grid item xs={4} className="paper device-status-clock">
                                    {current_time.utcOffset( entry.utc * 60 ).format( time_format )}
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