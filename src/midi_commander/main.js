import "../index.css"
import "./midi_commander.css"
import React                         from 'react';
import config                        from "../config.json"
import { Grid, Box, LinearProgress } from '@mui/material';
import { connect }                   from 'react-redux'
import { out_of_range }              from '../common/utils.js'
import { set_exp_pedal }             from '../store/slices/midi_commander_slice.js'
import WebSocketHelper               from '../common/websocket_helper.js';


class MidiCommanderPanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.midi_commander.websocket.url, config.midi_commander.websocket.poll_interval );
    }

    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            const data = JSON.parse( event.data );
            this.props.dispatch( set_exp_pedal( data ) );
        };
        this.ws_helper.start();
    }


    componentDidUpdate( prevProps ) {
        if ( this.props.selected_tab === this.props.index )
            this.ws_helper.resume();
        else
            this.ws_helper.pause();
    }


    render() {
        const { index, selected_tab, width,
                exp_pedal } = this.props;

        if ( out_of_range( index, selected_tab ) )
            return (<Box sx={{ width: Number( width ), overflow: 'hidden' }}/>)

        return (
            <Box className="box" sx={{ width: Number( width ) }}>
                <Grid container className="midi_commander-container" spacing={2}>
                    <Grid item xs={9}>
                    </Grid>
                    <Grid item xs={2}>
                        <LinearProgress className="midi_commander-exp_pedal" variant="determinate" value={exp_pedal * 100.0 / 127.0}/>
                    </Grid>
                    <Grid item xs={1} className="midi_commander-exp_pedal_value">
                        {exp_pedal}
                    </Grid>
                </Grid>

            </Box>
        );
    }
}



const mapStateToProps = (state, ownProps) => {
    return {
        selected_tab: state.dashboard.selected_tab,
        exp_pedal   : state.midi_commander.exp_pedal,
    }
}

export default connect( mapStateToProps )( MidiCommanderPanel );