import "../index.css"
import "./time.css"
import React         from 'react';
import moment        from 'moment'
import { Grid, Box } from '@mui/material';
import config        from "../config.json"


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
                    <Grid item xs={5} className="paper time-date">
                        {local_utc_offset.format( 'dddd' )}<br/>
                        {local_utc_offset.format( 'MMMM DD' )}
                    </Grid>
                    <Grid item xs={6} className="paper time-time">
                        {local_utc_offset.format( 'HH:mm:ss' )}
                    </Grid>
                </Grid>
            </Box>
        );
    }
}


export default TimePanel;