import "../index.css"
import "./music.css"
import config                                from "../config.json"
import React                                 from 'react';
import { connect }                           from 'react-redux'
import Marquee                               from "react-fast-marquee";
import { Box, Grid, Paper, Button }          from '@mui/material';
import WebSocketHelper                       from '../common/websocket_helper.js';
import { set_movie, set_episode, set_track } from '../store/slices/music_slice.js'

class MiniMusicPanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.now_playing.websocket.url, config.now_playing.websocket.poll_interval );

        this.background_ref = React.createRef();
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {

            const info = JSON.parse( event.data );

            switch( info.type ) {
                case 'movie':
                    this.props.dispatch( set_movie( info ) );
                    break
                case 'episode':
                    this.props.dispatch( set_episode( info ) );
                    break
                case 'track':
                    this.props.dispatch( set_track( info ) );
                    break
                default:
            }

        };
        this.ws_helper.start();
    }


    renderMarquee( min_len, text ) {
        if ( text.length > min_len ){
            return ( <Marquee gradient={false} speed={120} className="marquee">{text}</Marquee> )
        }
        return text;
    }

    renderAlbumArt( status, thumb ) {
        switch( status ) {
            case 'media.play':
            case 'media.resume':
            case 'media.scrobble':
                return <img className = "music-album-art-image music-album-art-glowing"
                            id        = "album-art"
                            alt       = "album art"
                            src       = {`${config.plex.server}${thumb}`}/>;
            default:
                return <img className = "music-album-art-image music-album-art-dimming"
                            id        = "album-art"
                            alt       = "album art"
                            src       = {`${config.plex.server}${thumb}`}/>;
        }
    }


    render() {
        const { artist, title, status, thumb } = this.props;

        return (
            <Box>
                <Grid container spacing={10} sx={{ padding: 3 }}>
                    <Grid item xs={3}>
                        <Box className="box">
                            <Paper elevation={0} className="paper music-album-art">
                                <Button onClick={this.playPause}>
                                    {this.renderAlbumArt( status, thumb )}
                                </Button>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Box className="box">
                            <Grid container>
                                <Grid item xs={12}>
                                    <Paper elevation={0} className="paper mini-music-artist">
                                        {this.renderMarquee( 25, `${artist}` )}
                                    </Paper>

                                    <Grid container className="music-title-bar" spacing={2}>
                                        <Grid item xs={12}>
                                            <Paper elevation={0} className="paper mini-music-title">
                                                {this.renderMarquee( 25, `${title}` )}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}



const mapStateToProps = state => {
    return {
        selected_tab: state.dashboard.selected_tab,
        status      : state.music.status,
        artist      : state.music.artist,
        album       : state.music.album,
        year        : state.music.year,
        title       : state.music.title,
        thumb       : state.music.thumb,
        background  : state.music.background,
        album_color : state.music.album_color,
    }
}

export default connect( mapStateToProps )( MiniMusicPanel );