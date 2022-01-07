import "../index.css"
import "./device-status.css"
import axios         from 'axios';
import React         from 'react';
import { Box, Grid } from '@mui/material';
import config        from "../config.json"
import { connect }   from 'react-redux'

class Space extends React.Component {

    shouldComponentUpdate( next_props, next_state ) {
        return this.props.selected !== next_props.selected;
    }

    triggerKeyboardMaestro = ( space, macro ) => ( event ) => {
        axios.get ( `${config.keyboard_maestro.server}/action.html?macro=${macro}&value=` )
    }


    render() {
        const { selected } = this.props;

        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid className="round-container" container spacing={0}>
                    {
                        Object.entries( config.space.list ).map( ([space, macro], index) => (
                            space.trim().toLowerCase() === selected
                            ? <Grid className="device-status-selected" item xs={4} key={index}> {space} </Grid>
                            : <Grid className="paper" item xs={4} key={index} onClick={this.triggerKeyboardMaestro(space, macro)}>{space}</Grid>
                        ))
                    }
                </Grid>
            </Box>
        );
    }
}

Space.defaultProps = {
    selected: 'web'
};

export default connect()( Space );