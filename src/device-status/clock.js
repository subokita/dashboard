import "../index.css"
import "./device-status.css"
import React         from 'react';
import moment        from 'moment'
import { Box, Grid } from '@mui/material';
import config        from "../config.json"

class Clock extends React.Component {
    shouldComponentUpdate = ( next_props, next_state ) => {
        return this.props.current_time !== next_props.current_time;
    }

    render() {
        const { current_time, width } = this.props;
        const time                    = moment( current_time );
        const time_format             = time.seconds() % 2 ? 'HH:mm' : 'HH mm'

        return (
            <Box sx={{ width: Number( width ) }}>
                <Grid container spacing={0} sx={{ padding: 1 }}>
                    <Grid item xs={12} className="paper device-status-date">
                        {time.utcOffset( config.time.local.utc * 60 ).format( 'ddd, MMM DD YYYY' )}
                    </Grid>
                    <Grid item xs={8} className="paper device-status-local device-status-clock">
                        {config.time.local.city}
                    </Grid>
                    <Grid item xs={4} className="paper device-status-local device-status-clock">
                        {time.utcOffset( config.time.local.utc * 60 ).format( time_format )}
                    </Grid>
                    {
                        config.time.world.map( (entry, index) => (
                            <Grid container key={index}>
                                <Grid item xs={8} className="paper device-status-clock">
                                    {entry.city}
                                </Grid>
                                <Grid item xs={4} className="paper device-status-clock">
                                    {time.utcOffset( entry.utc * 60 ).format( time_format )}
                                </Grid>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        );
    }
}


Clock.defaultProps = {
    current_time: moment().toISOString()
};

export default Clock;