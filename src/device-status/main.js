import "../index.css"
import config                from "../config.json"
import React                 from 'react';
import { Paper }             from '@mui/material'
import Stack                 from '@mui/material/Stack';
import WebSocketHelper       from '../common/websocket_helper.js';
import Clock                 from './clock.js'
import InputLanguage         from './input-language.js'
import Space                 from './space.js'
import USBDevices            from './usb-devices.js'
import { connect }           from 'react-redux'
import { set_device_status } from '../store/slices/device_status_slice.js'
import { notify }            from '../store/slices/dashboard_slice.js'
import { out_of_range }      from '../common/utils.js'


class DeviceStatusPanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.device_status.websocket.url, config.device_status.websocket.poll_interval );
    }

    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            const data = JSON.parse( event.data );
            this.props.dispatch( set_device_status( data ) );
        };
        this.ws_helper.start();
    }

    componentDidUpdate( prevProps ) {
        // if ( this.props.selected_tab === this.props.index )
        //     this.ws_helper.resume();
        // else
        //     this.ws_helper.pause();

        if ( this.props.language !== prevProps.language )
            this.props.dispatch( notify( ['💬', this.props.language] ) )

        if ( this.props.space !== prevProps.space )
            this.props.dispatch( notify( ['🖥', this.props.space] ) )
    }


    render() {
        const { selected_tab, current_time, space, language, connected_devices, index } = this.props;

        if ( out_of_range( index, selected_tab ) )
            return ( <Stack direction="row" spacing={2} className="device-status"/> )

        return (
            <Stack direction="row" spacing={2} className="device-status">
                <Paper className="paper" elevation={0}>
                    <Clock index={this.props.index}  width="300" current_time={current_time}/>
                </Paper>
                <Stack spacing={1}>
                    <Paper className="paper" elevation={0}>
                        <InputLanguage index={this.props.index} width="420" selected={language}  />
                    </Paper>
                    <Paper className="paper" elevation={0}>
                        <Space index={this.props.index} width="420" selected={space} />
                    </Paper>
                </Stack>
                <Paper className="paper" elevation={0}>
                    <USBDevices index={this.props.index} width="380" selected_tab={selected_tab} connected={connected_devices}/>
                </Paper>
            </Stack>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        selected_tab     : state.dashboard.selected_tab,
        current_time     : state.dashboard.current_time,
        space            : state.device_status.space,
        language         : state.device_status.language,
        connected_devices: state.device_status.connected_devices,
    }
}

export default connect( mapStateToProps )( DeviceStatusPanel );