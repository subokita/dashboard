import "../index.css"
import React                from 'react';
import { Box, Grid, Paper } from '@mui/material';
import CircleIcon           from '@mui/icons-material/Circle';
import config               from "../config.json"
import WebSocketHelper from '../common/websocket_helper.js';

class USBDevices extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            connected: []
        };

        this.ws_helper = new WebSocketHelper( config.usb.websocket.url, config.usb.websocket.poll_interval );
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            this.setState({
                connected: JSON.parse( event.data )
            })
        };
        this.ws_helper.start();
    }

    render() {
        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid container spacing={0} className="round-container">
                    {
                        config.usb.list.map( (item, index) => (
                            <Grid container spacing={0} key={index}>
                                <Grid item xs={1} sx={{ position: 'relative', top: '6px'}}>
                                    {
                                        this.state.connected.includes( item.id )
                                        ? <CircleIcon sx={{ width: '18px', color: '#0f0' }}/>
                                        : <CircleIcon sx={{ width: '18px', color: '#f00' }}/>
                                    }
                                </Grid>
                                <Grid item xs={11}>
                                    <Paper elevation={0} className="paper" sx={{ textAlign: 'left' }}>
                                        { item.name }
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


export default USBDevices;








