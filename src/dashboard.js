import './index.css';
import config                                       from "./config.json"
import WebSocketHelper                              from './common/websocket_helper.js';
import tab_mappings                                 from './tabs.js'
import moment                                       from 'moment';
import React                                        from 'react';
import { connect }                                  from 'react-redux'
import Timer                                        from 'tiny-timer'
import SwipeableViews                               from 'react-swipeable-views';
import RefreshIcon                                  from '@mui/icons-material/Refresh';
import {Fab, Tabs, Tab, Box, Typography, Snackbar } from '@mui/material';
import { set_tab, set_brightness, change_tab,
         update_current_time, close_snackbar }      from './store/slices/dashboard_slice.js'

class Dashboard extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.dashboard.websocket.url, config.dashboard.websocket.poll_interval );
        this.timer     = new Timer();
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            const info = JSON.parse( event.data )
            this.props.dispatch( set_tab( Number( info.selected_tab ) ) );

            if ( info.brightness !== this.props.brightness ) {
                this.props.dispatch( set_brightness( Number( info.brightness ).toFixed() ) );
                const dashboard = document.getElementById( 'dashboard' );
                dashboard.style.filter = `brightness(${this.props.brightness}%)`;
            }
        };
        this.ws_helper.start();

        this.timer.on( 'tick', (ms) => this.props.dispatch( update_current_time() ) );
        this.timer.start({ interval: 1000, stopwatch: false })
    }

    componentWillUnmount() {
        this.timer.stop();
    }

    onTabSelected = ( event, index ) => {
        this.props.dispatch( change_tab( index ) );
    }

    onChangeIndex = ( index ) => {
        this.props.dispatch( change_tab( index ) );
    }


    refreshPage = () => {
        window.location.reload();
    }

    closeSnackBar = (event) => {
        this.props.dispatch( close_snackbar() );
    }

    render() {
        const { selected_tab, current_time, snackbar_messages } = this.props;
        const local_utc_offset = moment( current_time ).utcOffset( config.time.local.utc * 60 );

        return (
            <Box id="dashboard" className="dashboard" sx={{ flexGrow: 1, display: 'flex' }}>
                <Box className={snackbar_messages.length ? "border-pulsate" : "border"}/>
                <div id="background-image" className="background-image"></div>
                <Tabs   orientation = "vertical"
                        variant     = "scrollable"
                        value       = {selected_tab}
                        onChange    = {this.onTabSelected}
                        className   = "tabs" >
                    {
                        tab_mappings.map( (item, index) => (
                            <Tab className="tab-item" key={index} index={index} icon={item.icon}/>
                        ))
                    }
                </Tabs>


                <SwipeableViews className="swipeableView" index={selected_tab} onChangeIndex={this.onChangeIndex}>
                    {tab_mappings.map( (item, index) => ( item.panel ))}
                </SwipeableViews>

                <Typography className="mini-clock">
                    {local_utc_offset.format( 'HH:mm' )}
                </Typography>
                <Fab className="refresh-button">
                    <RefreshIcon onClick={this.refreshPage}/>
                </Fab>
                <Snackbar
                    open                = {snackbar_messages.length > 0}
                    key                 = {snackbar_messages.length ? snackbar_messages[0].key : undefined}
                    autoHideDuration    = {2000}
                    anchorOrigin        = {{ vertical: 'top', horizontal: 'right' }}
                    onClose             = {this.closeSnackBar}>
                    <Typography className="snackbar">
                        {snackbar_messages.length ? snackbar_messages[0].message : undefined}
                    </Typography>
                </Snackbar>
            </Box>
        );
    }
}

const mapStateToProps = state => {
    return {
        selected_tab     : state.dashboard.selected_tab,
        brightness       : state.dashboard.brightness,
        current_time     : state.dashboard.current_time,
        snackbar_messages : state.dashboard.snackbar_messages,
    }
}

export default connect( mapStateToProps )( Dashboard );