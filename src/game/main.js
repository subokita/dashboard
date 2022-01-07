import "../index.css"
import "./game.css"

import { connect }          from 'react-redux'
import React                from 'react';
import { Box, Grid, Paper } from '@mui/material';
import config               from "../config.json"
import WebSocketHelper      from '../common/websocket_helper.js';
import { set_info }         from '../store/slices/game_slice.js'
import { out_of_range }     from '../common/utils.js'

class GamePanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.game_info.websocket.url, config.game_info.websocket.poll_interval );
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            const info = JSON.parse( event.data );
            this.props.dispatch( set_info( info ));
        };

        this.ws_helper.start();
    }


    componentDidUpdate( prevProps ) {
        if ( this.props.selected_tab === this.props.index )
            this.ws_helper.resume();
        else
            this.ws_helper.pause();
    }


    renderDetail( props ) {
        const { release_date, developers, platforms, genres } = props;
        return (<>
            <Grid item xs={12} className="game-detail-header">
                Release Date
            </Grid>
            <Grid item xs={12} className="game-detail-entry">
                {release_date}
            </Grid>
            <Grid item xs={12} className="game-detail-header">
                Platforms
            </Grid>
            <Grid item xs={12} className="game-detail-entry">
                {platforms}
            </Grid>
            <Grid item xs={12} className="game-detail-header">
                Genres
            </Grid>
            <Grid item xs={12} className="game-detail-entry">
                {genres}
            </Grid>
            <Grid item xs={12} className="game-detail-header">
                Developers
            </Grid>
            <Grid item xs={12} className="game-detail-entry">
                {developers}
            </Grid>
        </>)
    }


    render() {
        const { selected_tab, image, name, deck, index, width } = this.props;

        if ( out_of_range( index, selected_tab ) )
            return (<Box sx={{ width: Number( width ), overflow: 'hidden' }}/>)

        return (
            <Box sx={{ width: Number( width ), overflow: 'hidden' }}>
                <Grid container spacing={3} sx={{ padding: 3 }}>
                    <Grid item xs={4}>
                        <Box className="box">
                            <Paper elevation={0} className="paper">
                                <img alt="game art" className="game-art-image" src={image}/>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} className="game-title">
                                {name}
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container className="game-detail-container">
                                    <Grid item xs={12} className={ selected_tab === index ? "game-detail" : "" }>
                                        {this.renderDetail( this.props ) }
                                        {this.renderDetail( this.props ) }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container sx={{ overflow: 'hidden', height: '300px' }}>
                                    <Grid item xs={12} className="game-deck">
                                        {deck}
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}


const mapStateToProps = state => {
    return {
        selected_tab: state.dashboard.selected_tab,
        image       : state.game.image,
        name        : state.game.name,
        release_date: state.game.release_date,
        developers  : state.game.developers,
        platforms   : state.game.platforms,
        deck        : state.game.deck,
        genres      : state.game.genres,
    }
}

export default connect( mapStateToProps )( GamePanel );