import React         from 'react';
import Stack         from '@mui/material/Stack';
import Clock         from './clock.js'
import InputLanguage from './input-language.js'
import Space         from './space.js'
import USBDevices    from './usb-devices.js'
// import { Item }      from '../common/item.js'
import { Paper } from '@mui/material'
import "../index.css"

class DeviceStatusPanel extends React.Component {
    render() {
        return (
            <Stack direction="row" spacing={2}>
                <Paper className="paper" elevation={0}>
                    <Clock width="300"/>
                </Paper>
                <Stack spacing={1}>
                    <Paper className="paper" elevation={0}>
                        <InputLanguage width="420" />
                    </Paper>
                    <Paper className="paper" elevation={0}>
                        <Space width="420" />
                    </Paper>
                </Stack>
                <Paper className="paper" elevation={0}>
                    <USBDevices width="380"/>
                </Paper>
            </Stack>
        );
    }
}


export default DeviceStatusPanel;