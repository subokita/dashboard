import "../index.css"
import "./device-status.css"
import React           from 'react';
import { Box, Grid }   from '@mui/material';
import config          from "../config.json"
import WebSocketHelper from '../common/websocket_helper.js';


class InputLanguage extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            selected: 'english',
        };

        this.ws_helper = new WebSocketHelper( config.language.websocket.url, config.language.websocket.poll_interval );
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            this.setState({
                selected: event.data.trim().toLowerCase(),
            })
        };
        this.ws_helper.start();
    }

    render() {
        const { selected } = this.state;

        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid className="round-container" container spacing={0}>
                    {
                        config.language.list.map( (language, index) => (
                            language.trim().toLowerCase() === selected
                            ? <Grid className="device-status-selected" item xs={4} key={index}> {language} </Grid>
                            : <Grid className="paper" item xs={4} key={index}> {language} </Grid>
                        ))
                    }
                    {
                        "english" === selected
                        ? <Grid className="device-status-selected" item xs={12}> English </Grid>
                        : <Grid className="paper" item xs={12}> English </Grid>
                    }
                </Grid>
            </Box>
        );
    }
}


export default InputLanguage