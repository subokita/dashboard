import "../index.css"
import "./music.css"
import axios                        from 'axios'
import React                        from 'react';
import { Box, Grid, Paper, Button } from '@mui/material';
import config                       from "../config.json"
import ArrowCircleLeftOutlinedIcon  from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import WebSocketHelper              from '../common/websocket_helper.js';


class MusicPanel extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            status     : "",
            artist     : "",
            album      : "",
            year       : "",
            title      : "",
            thumb      : "",
            album_color: null,
        }

        this.ws_helper = new WebSocketHelper( config.now_playing.websocket.url, config.now_playing.websocket.poll_interval );
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {

            const info = JSON.parse( event.data );

            this.setState({
                status     : info.status,
                artist     : info.artist,
                album      : info.album,
                year       : (typeof info.year === 'number') ? `(${info.year})` : "",
                title      : info.title,
                thumb      : info.thumb,
                album_color: JSON.parse( info.album_color ),
            });
        };
        this.ws_helper.start();
    }


    shouldComponentUpdate( next_props, next_state ) {
        if (this.state !== next_state )
            return true;
        return false;
    }


    renderMarquee( min_len, text ) {
        if ( text.length > min_len )
            return ( <marquee width="100%" scrollamount="10">{text}</marquee> )
        return text;
    }


    playPause = () => {
        switch( this.state.status ) {
            case 'media.play':
            case 'media.resume':
            case 'media.scrobble':
                axios.put( `${config.now_playing.rest.pause}` );
                return;
            default:
                axios.put( `${config.now_playing.rest.play}` );
        }
    }

    skipPrevious = () => {
        axios.put( `${config.now_playing.rest.prev}` );
    }

    skipNext = () => {
        axios.put( `${config.now_playing.rest.next}` );
    }

    animateBackground( state ) {
        switch( state.status ) {
            case 'media.play':
            case 'media.resume':
            case 'media.scrobble':
                var hsls = [];
                for( var index in state.album_color ) {
                    const hue = state.album_color[index][0] * 360;
                    const lum = Math.min( state.album_color[index][1] * 100, 30 );
                    const sat = state.album_color[index][2] * 100;

                    hsls[index] = `hsl( ${hue}, ${sat}%, ${lum}% )`
                }

                document.body.style.background     = `linear-gradient(-45deg, ${hsls[2]}, ${hsls[1]}, ${hsls[0]}, ${hsls[0]} )`;
                document.body.style.backgroundSize = '200% 200%';
                break;
            default:
                document.body.style.background     = `#333`;
                document.body.style.backgroundSize = '100% 100%';
                break;
        }
    }


    renderAlbumArt( state ) {
        switch( state.status ) {
            case 'media.play':
            case 'media.resume':
            case 'media.scrobble':
                return <img className = "music-album-art-image music-album-art-glowing"
                            id        = "album-art"
                            alt       = "album art"
                            src       = {`${config.plex.server}${state.thumb}`}/>;
            default:
                return <img className = "music-album-art-image music-album-art-dimming"
                            id        = "album-art"
                            alt       = "album art"
                            src       = {`${config.plex.server}${state.thumb}`}/>;
        }
    }



    render() {
        this.animateBackground( this.state );


        return (
            <Box sx={{ width: Number( this.props.width ), overflow: 'hidden' }}>
                <Grid container spacing={10} sx={{ padding: 3 }}>
                    <Grid item xs={4}>
                        <Box className="box" width={400}>
                            <Paper elevation={0} className="paper music-album-art">
                                <Button onClick={this.playPause}>
                                    {this.renderAlbumArt(this.state)}
                                </Button>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Box width={700} className="box">
                            <Grid container>
                                <Grid item xs={12}>
                                    <Paper elevation={0} className="paper music-artist">
                                        {this.renderMarquee( 25, `${this.state.artist}` )}
                                    </Paper>

                                    <Grid container className="music-artist-bar" spacing={2}>
                                        <Grid item xs={1}>
                                            <Button onClick={this.skipPrevious}>
                                                <ArrowCircleLeftOutlinedIcon fontSize="large" className="music-button"/>
                                            </Button>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Paper elevation={0} className="paper music-title">
                                                {this.renderMarquee( 40, `${this.state.title}` )}
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Button onClick={this.skipNext}>
                                                <ArrowCircleRightOutlinedIcon fontSize="large" className="music-button"/>
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Paper elevation={0} className="paper music-album">
                                        {this.renderMarquee( 35, `${this.state.album} ${this.state.year}` )}
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


export default MusicPanel;