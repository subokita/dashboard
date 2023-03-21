import "../index.css"
import "./chrono.css"
import React                    from 'react';
import config                   from '../config.json'
import moment                   from 'moment'
import { Grid, Box }            from '@mui/material'
import { connect }              from 'react-redux'
import { out_of_range }         from '../common/utils.js'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { set_time_and_status }  from '../store/slices/chrono_slice.js'
import WebSocketHelper          from '../common/websocket_helper.js';


class ChronoPanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.chrono.websocket.url, config.chrono.websocket.poll_interval );
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            const data = JSON.parse( event.data );
            this.props.dispatch( set_time_and_status( data ) );
        };
        this.ws_helper.start();
    }


    componentDidUpdate( prevProps ) {
        if ( this.props.selected_tab === this.props.index )
            this.ws_helper.resume();
        else
            this.ws_helper.pause();
    }


    renderTimer( current_time, end_time, status ) {
        const end_time_object  = moment( end_time ).utcOffset( config.time.local.utc * 60 );
        const remaining_time   = Math.max( end_time_object.diff( current_time, 'seconds' ), 0 );

        let duration      = 0;
        let circle_colors = ['#333'];
        let colors_time   = [];

        switch( status ) {
            case 'running':
                duration      = 1500;
                circle_colors = ['#00ff00', '#ffff00', '#ffa500', '#ff0000'];
                colors_time   = [1500, 1125, 750, 375];
                break;
            case 'break':
                duration      = 300;
                circle_colors = ['#0000ff', '#00ffff', '#00a5ff', '#000000'];
                colors_time   = [300, 225, 150, 75];
                break;
            default:
                return <CountdownCircleTimer duration = {duration} colors = {circle_colors} size = {300}/>;
        }

        return <CountdownCircleTimer
                    isPlaying
                    duration             = {duration}
                    initialRemainingTime = {remaining_time}
                    colors               = {circle_colors}
                    colorsTime           = {colors_time}
                    size                 = {300}
                    onComplete           = {() => {return { shouldRepeat: true  }}}
                >
                    {
                        ( {remainingTime} ) =>
                        <Grid container spacing={0}>
                            <Grid item xs={12} className="paper chrono-min">
                                { moment.utc( remaining_time * 1000 ).format( 'mm' ) }
                            </Grid>
                            <Grid item xs={12} className="paper chrono-sec">
                                { moment.utc( remaining_time * 1000 ).format( 'ss' ) }
                            </Grid>
                        </Grid>
                    }

                </CountdownCircleTimer>
    }

    render() {
        const { current_time, index, selected_tab, width, end_time, status } = this.props;

        if ( out_of_range( index, selected_tab ) )
            return (<Box sx={{ width: Number( width ), overflow: 'hidden' }}/>)

        return (
            <Box className="box" sx={{ width: Number( width ) }}>
                <Grid container spacing={3} sx={{ paddingLeft: 5, paddingTop: 5 }} >
                    <Grid item xs={4}>
                    </Grid>
                    <Grid item xs={5}>
                        { this.renderTimer( current_time, end_time, status ) }
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
        end_time    : state.chrono.end_time,
        status      : state.chrono.status,
    }
}

export default connect( mapStateToProps )( ChronoPanel );