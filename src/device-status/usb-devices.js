import "../index.css"
import "./device-status.css"
import React         from 'react';
import { Box, Grid } from '@mui/material';
import config        from "../config.json"


class USBDevices extends React.Component {

    renderItem( item, index ) {
        const { connected } = this.props;
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

    shouldComponentUpdate( next_props, next_state ) {
        if ( this.props.selected_tab === this.props.index )
            return JSON.stringify( this.props.connected ) !== JSON.stringify( next_props.connected )
        return this.props.selected_tab !== next_props.selected_tab;
    }

    render() {
        const { selected_tab } = this.props;

        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid container spacing={0} className="round-container" height={360}>
                    <Grid container spacing={0} className={ selected_tab === 1 ? "device-status-usb" : ""}>
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

USBDevices.defaultProps = {
    selected_tab: 1,
    connected   : []
};

export default USBDevices;