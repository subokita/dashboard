import "../index.css"
import "./device-status.css"
import React           from 'react';
import { Box, Grid }   from '@mui/material';
import config          from "../config.json"

class Space extends React.Component {

    shouldComponentUpdate( next_props, next_state ) {
        return this.props.selected !== next_props.selected;
    }

    render() {
        const { selected } = this.props;

        return (
            <Box sx={{ width: Number( this.props.width ) }}>
                <Grid className="round-container" container spacing={0}>
                    {
                        config.space.list.map( (space, index) => (
                            space.name.trim().toLowerCase() === selected
                            ? <Grid className="device-status-selected" item xs={4} key={index}> {space.name} </Grid>
                            : <Grid className="paper" item xs={4} key={index}>{space.name}</Grid>
                        ))
                    }
                </Grid>
            </Box>
        );
    }
}

Space.defaultProps = {
    selected: 'web'
};

export default Space;