import "../index.css"
import "./device-status.css"
import React         from 'react';
import { Box, Grid } from '@mui/material';
import config        from "../config.json"

class InputLanguage extends React.Component {
    shouldComponentUpdate( next_props, next_state ) {
        return this.props.selected !== next_props.selected;
    }

    render() {
        const { selected } = this.props;

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


InputLanguage.defaultProps = {
    selected: 'english'
};

export default InputLanguage;