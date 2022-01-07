import "../index.css"
import "./device-status.css"
import React            from 'react';
import axios            from 'axios';
import { Box, Grid }    from '@mui/material';
import config           from "../config.json"
import { connect }      from 'react-redux'

class InputLanguage extends React.Component {
    shouldComponentUpdate( next_props, next_state ) {
        return this.props.selected !== next_props.selected;
    }

    triggerKeyboardMaestro = ( language, macro ) => ( event ) => {
        axios.get ( `${config.keyboard_maestro.server}/action.html?macro=${macro}&value=` )
    }

    renderLanguage( language, macro ) {
        const { selected } = this.props;
        const xs = language === 'english' ? 12 : 4;

        return  language.trim().toLowerCase() === selected
                ? <Grid className="device-status-selected" item xs={xs} key={language}> {language} </Grid>
                : <Grid className="paper" item xs={xs} key={language} onClick={this.triggerKeyboardMaestro(language, macro)}> {language} </Grid>;
    }

    render() {
        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid className="round-container" container spacing={0}>
                    {
                        Object.entries( config.language.list ).map( ([language, macro], index) => (
                            this.renderLanguage( language, macro )
                        ))
                    }
                </Grid>
            </Box>
        );
    }
}


InputLanguage.defaultProps = {
    selected: 'english'
};


export default connect()( InputLanguage );