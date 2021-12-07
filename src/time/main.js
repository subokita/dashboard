import "../index.css"
import "./time.css"
import React                from 'react';
import moment               from 'moment'
import { Paper, Grid, Box } from '@mui/material';
import config               from "../config.json"


class TimePanel extends React.Component {
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
        const local_utc_offset = this.state.current_time.utcOffset( config.time.local.utc * 60 );
        return (
            <Box className="box" sx={{ width: Number( this.props.width ) }}>
                <Grid container spacing={3} sx={{ padding: 8 }}>
                    <Grid item xs={5}>
                        <Paper className="paper time-date" elevation={0}>
                            {local_utc_offset.format( 'dddd' )}
                        </Paper>
                        <Paper className="paper time-date" elevation={0}>
                            {local_utc_offset.format( 'MMMM DD' )}
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className="paper time-time" elevation={0}>
                            {local_utc_offset.format( 'HH:mm:ss' )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}


export default TimePanel;