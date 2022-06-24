import "../index.css"
import "./music.css"
import config                               from "../config.json"
import React                                from 'react';
import { connect }                          from 'react-redux'
import Marquee                              from "react-fast-marquee";
import { Box, Grid, Paper, Button }         from '@mui/material';
import ArrowCircleLeftOutlinedIcon          from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon         from '@mui/icons-material/ArrowCircleRightOutlined';
import WebSocketHelper                      from '../common/websocket_helper.js';
import { set_movie, set_episode, set_track,
         play_pause, previous, next }       from '../store/slices/music_slice.js'
import { out_of_range }                     from '../common/utils.js'

class MusicPanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.now_playing.websocket.url, config.now_playing.websocket.poll_interval );
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
            return ( <Marquee gradient={false} speed={30} className="marquee">{text}</Marquee> )
        }
        return text;
    }


    playPause = () => {
        this.props.dispatch( play_pause() );
    }

    skipPrevious = () => {
        this.props.dispatch( previous() );
    }

    skipNext = () => {
        this.props.dispatch( next() );
    }

    animateBackground( status, background ) {
        const background_element = document.getElementById( 'background-image' );

        switch( status ) {
            case 'media.rate':
                break;
            case 'media.play':
            case 'media.resume':
            case 'media.scrobble':
                // background.style.backgroundImage = `linear-gradient(-45deg, ${album_color[2]}, ${album_color[1]}, ${album_color[0]}, ${album_color[0]} )`;
                // background.style.backgroundSize  = '200% 200%';
                background_element.style.backgroundImage = `url("${config.plex.server}${background}")`;
                break;
            default:
                background_element.style.background = '';
                background_element.style.backgroundSize = '100% 100%';
                break;
        }
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
        const { artist, title, album, year, status,
                thumb, background, width, selected_tab, index } = this.props;

        this.animateBackground( status, background );

        if ( out_of_range( index, selected_tab ) )
            return (<Box sx={{ width: Number( width ), overflow: 'hidden' }}/>)

        return (
            <Box sx={{ width: Number( this.props.width ), overflow: 'hidden' }}>
                <Grid container spacing={10} sx={{ padding: 3 }}>
                    <Grid item xs={4}>
                        <Box className="box" width={400}>
                            <Paper elevation={0} className="paper music-album-art">
                                <Button onClick={this.playPause}>
                                    {this.renderAlbumArt( status, thumb )}
                                </Button>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Box width={700} className="box">
                            <Grid container>
                                <Grid item xs={12}>
                                    <Paper elevation={0} className="paper music-artist">
                                        {this.renderMarquee( 25, `${artist}` )}
                                    </Paper>

                                    <Grid container className="music-title-bar" spacing={2}>
                                        <Grid item xs={1}>
                                            <Button onClick={this.skipPrevious}>
                                                <ArrowCircleLeftOutlinedIcon fontSize="large" className="music-button"/>
                                            </Button>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Paper elevation={0} className="paper music-title">
                                                {this.renderMarquee( 40, `${title}` )}
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button onClick={this.skipNext}>
                                                <ArrowCircleRightOutlinedIcon fontSize="large" className="music-button"/>
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Paper elevation={0} className="paper music-album">
                                        {this.renderMarquee( 35, `${album} ${year}` )}
                                    </Paper>
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

export default connect( mapStateToProps )( MusicPanel );