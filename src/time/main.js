import "../index.css"
import "./time.css"
import React         from 'react';
import config        from "../config.json"
import moment        from 'moment';
import { Grid, Box } from '@mui/material';
import { connect }   from 'react-redux'
import { out_of_range }     from '../common/utils.js'


class TimePanel extends React.Component {
    render() {
        const { current_time, index, selected_tab, width } = this.props;

        if ( out_of_range( index, selected_tab ) )
            return (<Box sx={{ width: Number( width ), overflow: 'hidden' }}/>)

        const local_utc_offset = moment( current_time ).utcOffset( config.time.local.utc * 60 );

        return (
            <Box className="box" sx={{ width: Number( width ) }}>
                <Grid container spacing={3} sx={{ paddingLeft: 5, paddingTop: 5 }}>
                    <Grid item xs={5} className="paper time-date">
                        {local_utc_offset.format( 'dddd' )}<br/>
                        {local_utc_offset.format( 'MMMM DD' )}
                    </Grid>
                    <Grid item xs={7} className="paper time-time">
                        {local_utc_offset.format( 'HH:mm:ss' )}
                    </Grid>
                </Grid>
            </Box>
        );
    }
}



const mapStateToProps = (state, ownProps) => {
    return {
        selected_tab: state.dashboard.selected_tab,
        current_time: state.dashboard.current_time,
    }
}

export default connect( mapStateToProps )( TimePanel );