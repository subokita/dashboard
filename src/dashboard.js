import './index.css';
import config                                       from "./config.json"
import moment                                       from 'moment';
import React                                        from 'react';
import { connect }                                  from 'react-redux'
import SwipeableViews                               from 'react-swipeable-views';
import {Fab, Tabs, Tab, Box, Avatar, Typography}    from '@mui/material';
import { set_tab, set_brightness,
         change_tab, update_current_time } from './store/slices/dashboard_slice.js'

import DeviceStatusPanel             from './device-status/main.js'
import TimePanel                     from './time/main.js'
import MusicPanel                    from './music/main.js'
import SchedulePanel                 from './schedule/main.js'
import TwitchPanel                   from './twitch/main.js'
import GamePanel                     from './game/main.js'

import SportsEsportsIcon             from '@mui/icons-material/SportsEsports';
import DevicesIcon                   from '@mui/icons-material/Devices';
import MusicNoteIcon                 from '@mui/icons-material/MusicNote';
import EventAvailableIcon            from '@mui/icons-material/EventAvailable';
import AccessTimeIcon                from '@mui/icons-material/AccessTime';
import RefreshIcon                   from '@mui/icons-material/Refresh';
import LiveTvIcon                    from '@mui/icons-material/LiveTv';

import WebSocketHelper               from './common/websocket_helper.js';
import CzechPanel                    from './cheatsheet/czech.js'
import HebrewPanel                   from './cheatsheet/hebrew.js'
import SwahiliPanel                  from './cheatsheet/swahili.js'


class Dashboard extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.dashboard.websocket.url, config.dashboard.websocket.poll_interval );

        this.tabs = [
            {
                icon : <AccessTimeIcon/>,
                panel: <TimePanel/>
            },
            {
                icon : <DevicesIcon/>,
                panel: <DeviceStatusPanel/>,
            },
            {
                icon : <MusicNoteIcon/>,
                panel: <MusicPanel/>
            },
            {
                icon : <SportsEsportsIcon/>,
                panel: <GamePanel width={1200}/>
            },
            {
                icon : <EventAvailableIcon/>,
                panel: <SchedulePanel/>
            },
            {
                icon : <LiveTvIcon/>,
                panel: <TwitchPanel/>
            },
            {
                icon: <Avatar className="tabs-avatar" src="icons8-czech_republic.png"/>,
                panel: <CzechPanel/>
            },
            {
                icon: <Avatar className="tabs-avatar" src="icons8-israel.png"/>,
                panel: <HebrewPanel/>
            },
            {
                icon: <Avatar className="tabs-avatar" src="icons8-russian_federation.png"/>,
                panel: <div/>
            },
            {
                icon: <Avatar className="tabs-avatar" src="icons8-south_korea.png"/>,
                panel: <div/>
            },
            {
                icon: <Avatar className="tabs-avatar" src="icons8-sweden.png"/>,
                panel: <div/>
            },
            {
                icon: <Avatar className="tabs-avatar" src="icons8-tanzania.png"/>,
                panel: <SwahiliPanel/>
            },
            {
                icon: <Avatar className="tabs-avatar" src="icons8-turkey.png"/>,
                panel: <div/>
            },
        ];


        this.timer_ID = null;
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
        this.timer_ID = setInterval( () => this.tick(), 1000 );
    }

    componentWillUnmount() {
        clearInterval( this.timer_ID );
    }

    tick() {
        this.props.dispatch( update_current_time( moment().toISOString() ) );
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

    render() {
        const { selected_tab, brightness, current_time } = this.props;
        const local_utc_offset = moment( current_time ).utcOffset( config.time.local.utc * 60 );

        return (
            <Box id="dashboard" className="dashboard" sx={{ flexGrow: 1, display: 'flex' }}>
                <div id="background-image" class="background-image"></div>
                <Tabs   orientation = "vertical"
                        variant     = "scrollable"
                        value       = {selected_tab}
                        onChange    = {this.onTabSelected}
                        className   = "tabs" >
                    {
                        this.tabs.map( (item, index) => (
                            <Tab className="tab-item" index={index} icon={item.icon}/>
                        ))
                    }
                </Tabs>


                <SwipeableViews index={selected_tab} onChangeIndex={this.onChangeIndex}>
                    {this.tabs.map( (item, index) => ( item.panel ))}
                </SwipeableViews>

                <Typography className="mini-clock">
                    {local_utc_offset.format( 'HH:mm' )}
                </Typography>
                <Fab sx={{ width: '40px', height: '40px', position: 'fixed', right: '1.5%', bottom: '5%' }}>
                    <RefreshIcon onClick={this.refreshPage}/>
                </Fab>

            </Box>
        );
    }
}

const mapStateToProps = state => {
    return {
        selected_tab: state.dashboard.selected_tab,
        brightness  : state.dashboard.brightness,
        current_time: state.dashboard.current_time,
    }
}

export default connect( mapStateToProps )( Dashboard );