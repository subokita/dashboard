import "../index.css"
import "./device-status.css"
import React           from 'react';
import { Box, Grid }   from '@mui/material';
import config          from "../config.json"
import WebSocketHelper from '../common/websocket_helper.js';


class USBDevices extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            connected         : [],
            newly_connected   : [],
            newly_disconnected: []
        };

        this.ws_helper = new WebSocketHelper( config.usb.websocket.url, config.usb.websocket.poll_interval );
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            this.setState({
                connected: JSON.parse( event.data ),
            })
        };
        this.ws_helper.start();
    }


    renderItem( item, index ) {
        const { connected } = this.state;
        const class_name    = connected.includes( item.id ) ? 'blinking-on' : 'blinking-off'

        return (
            <Grid container spacing={0} key={index}>
                <Grid item xs={1} className={class_name}>●</Grid>
                <Grid item xs={11} className="paper device-status-name">
                    { item.name }
                </Grid>
            </Grid>
        );
    }


    render() {
        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid container spacing={0} className="round-container" height={360}>
                    <Grid container spacing={0} className="device-status-usb">
                        {
                            config.usb.list.map( (item, index) => (
                                this.renderItem( item, index )
                            ))
                        }
                        {
                            config.usb.list.map( (item, index) => (
                                this.renderItem( item, index )
                            ))
                        }
                    </Grid>
                </Grid>
            </Box>
        );
    }
}


export default USBDevices;








