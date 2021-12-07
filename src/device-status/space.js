import "../index.css"
import "./device-status.css"
import React                from 'react';
import { Box, Grid, Paper } from '@mui/material';
import config               from "../config.json"
import WebSocketHelper from '../common/websocket_helper.js';

class Space extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            selected: ''
        };

        this.ws_helper = new WebSocketHelper( config.space.websocket.url, config.space.websocket.poll_interval );
    }

    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            this.setState({
                selected: event.data.trim().toLowerCase()
            })
        };
        this.ws_helper.start();
    }


    renderItem( space ) {
        if( space.trim().toLowerCase() === this.state.selected.trim().toLowerCase() )
            return <Paper className="paper device-status-selected" elevation={0}> {space} </Paper>;
        return  <Paper className="paper" elevation={0}> {space} </Paper>;
    }


    render() {
        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid className="round-container" container spacing={0}>
                    {
                        config.space.list.map( (space, index) => (
                            <Grid item xs={4} key={index}>
                                {this.renderItem( space )}
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        );
    }
}


export default Space;