import './index.css';
import config                        from "./config.json"
import axios                         from 'axios'
import React                         from 'react';
import SwipeableViews                from 'react-swipeable-views';
import {Fab, Tabs, Tab, Box, Avatar} from '@mui/material';

import DeviceStatusPanel             from './device-status/main.js'
import TimePanel                     from './time/main.js'
import MusicPanel                    from './music/main.js'
import SchedulePanel                 from './schedule/main.js'
import TwitchPanel                   from './twitch/main.js'

import DevicesIcon                   from '@mui/icons-material/Devices';
import MusicNoteIcon                 from '@mui/icons-material/MusicNote';
import EventAvailableIcon            from '@mui/icons-material/EventAvailable';
import AccessTimeIcon                from '@mui/icons-material/AccessTime';
import RefreshIcon                   from '@mui/icons-material/Refresh';

import CzechPanel                    from './cheatsheet/czech.js'
import HebrewPanel                   from './cheatsheet/hebrew.js'
import WebSocketHelper               from './common/websocket_helper.js';


class Dashboard extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            selected_tab: 0,
        }

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
                icon : <EventAvailableIcon/>,
                panel: <SchedulePanel/>
            },
            // {
            //     icon: <Avatar className="tabs-avatar" src="icons8-twitch.png"/>,
            //     panel: <TwitchPanel/>
            // },
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
                panel: <div/>
            },
            {
                icon: <Avatar className="tabs-avatar" src="icons8-turkey.png"/>,
                panel: <div/>
            },
        ]
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            this.setState({
                selected_tab: Number( event.data )
            })
        };
        this.ws_helper.start();
    }



    shouldComponentUpdate( next_props, next_state ) {
        if (this.state.selected_tab !== next_state.selected_tab)
            return true;
        return false;
    }

    onTabSelected = ( event, index ) => {
        this.setState({
            selected_tab: index
        });

        axios.put( `${config.dashboard.rest.put}/${index}` );
    }

    onChangeIndex = ( index ) => {
        this.setState({
            selected_tab: index
        });

        axios.put( `${config.dashboard.rest.put}/${index}` );
    }

    refreshPage = () => {
        window.location.reload();
    }

    render() {

        return (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <Tabs   orientation = "vertical"
                        variant     = "scrollable"
                        value       = {this.state.selected_tab}
                        onChange    = {this.onTabSelected}
                        className   = "tabs" >
                    {
                        this.tabs.map( (item, index) => (
                            <Tab className="tab-item" index={index} icon={item.icon}/>
                        ))
                    }
                </Tabs>


                <SwipeableViews index={this.state.selected_tab} onChangeIndex={this.onChangeIndex}>
                    {this.tabs.map( (item, index) => ( item.panel ))}
                </SwipeableViews>

                 <Fab sx={{ width: '40px', height: '40px', position: 'fixed', right: '1.5%', bottom: '5%' }}>
                    <RefreshIcon onClick={this.refreshPage}/>
                </Fab>

            </Box>
        );
    }
}


export default Dashboard;