import "../index.css"
import "./device-status.css"
import React                from 'react';
import { Box, Grid, Paper } from '@mui/material';
import config               from "../config.json"
import WebSocketHelper      from '../common/websocket_helper.js';

class InputLanguage extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            selected: 'english'
        };

        this.ws_helper = new WebSocketHelper( config.language.websocket.url, config.language.websocket.poll_interval );
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            this.setState({
                selected: event.data.trim().toLowerCase()
            })
        };
        this.ws_helper.start();
    }

    renderItem( language ) {
        if( language.trim().toLowerCase() === this.state.selected.trim().toLowerCase() )
            return <Paper className="paper device-status-selected" elevation={0}> {language} </Paper>;
        return  <Paper className="paper" elevation={0}> {language} </Paper>;
    }


    render() {
        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid className="round-container" container spacing={0}>
                    {
                        config.language.list.map( (language, index) => (
                            <Grid item xs={4} key={index}>
                                {this.renderItem( language )}
                            </Grid>
                        ))
                    }
                    <Grid item xs={12}>
                        {this.renderItem( "English" )}
                    </Grid>
                </Grid>
            </Box>
        );
    }
}


export default InputLanguage