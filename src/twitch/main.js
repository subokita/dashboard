import "../index.css"
import "./twitch.css"

import moment       from 'moment';
import { connect }  from 'react-redux'
import config       from "../config.json"
import OBSWebSocket from 'obs-websocket-js';
import React        from 'react';
import { Grid }     from '@mui/material';
import { set_heartbeat_state, set_boya_lavalier_mic,
         set_elgato_hd_60s, set_blackhole, set_current_scene } from '../store/slices/twitch_slice.js'


class TwitchPanel extends React.Component {
    constructor( props ){
        super( props );
        this.obs = new OBSWebSocket();
    }

    componentDidMount() {
        this.obs.connect({address: config.twitch.obs.websocket.url})
                .then(() => {
                    console.log(`Success! We're connected & authenticated.`);
                    return this.obs.send('GetCurrentScene');
                 })
                .then( (data) => {
                    this.props.dispatch( set_current_scene( data.name ));
                })
                .catch( (err) => {
                    console.log(err);
                });


        this.obs.on('SwitchScenes', data => {
            this.props.dispatch( set_current_scene( data.sceneName ));
        })

        this.obs.on( 'StreamStatus', data => {
            this.props.dispatch( set_heartbeat_state( data ) );

            this.obs.send( 'GetVolume', { source: '01 Boya Lavalier Mic' } )
                    .then( (data) => {
                        this.props.dispatch( set_boya_lavalier_mic( !data.muted ) );
                    })
            this.obs.send( 'GetVolume', { source: '02 Elgato HD 60S+' } )
                    .then( (data) => {
                        this.props.dispatch( set_elgato_hd_60s( !data.muted ) );
                    })
            this.obs.send( 'GetVolume', { source: '03 Blackhole 2ch' } )
                    .then( (data) => {
                        this.props.dispatch( set_blackhole( !data.muted ) );
                    })
        })

        this.obs.on('error', err => {
            console.error('socket error:', err);
        });
    }

    componentWillUnmount() {
        this.obs.disconnect();
    }


    renderItem( name, status ) {
        const class_name = status ? 'twitch-status-on': 'twitch-status-off';

        return(<>
            <Grid item xs={2} className={class_name}>●</Grid>
            <Grid item xs={10}>
               {name}
            </Grid>
        </>);
    }


    renderCurrentScene( current_scene ) {
        switch( current_scene ) {
            case 'Game Streaming':
                return <Grid item xs={12} className="twitch-scene twitch-scene-streaming">{current_scene}</Grid>
            case 'Break':
                return <Grid item xs={12} className="twitch-scene twitch-scene-break">{current_scene}</Grid>
            default:
                return <Grid item xs={12} className="twitch-scene">{current_scene}</Grid>
        }
    }

    render() {
        const { streaming, boya_lavalier_mic, elgato_hd_60s, blackhole,
                total_stream_time, cpu_usage, fps, num_dropped_frames,
                num_total_frames, render_missed_frames, render_total_frames,
                strain, current_scene, selected_tab } = this.props;

        return (
            <Grid container spacing={0} sx={{ padding: 3 }}>
                <Grid item xs={5} >
                {
                    selected_tab === 5
                    ? <iframe title="twitch-chat" class="twitch-chat" scrolling="no" src={config.twitch.chat.iframe_src}/>
                    : <div class="twitch-chat"/>
                }
                </Grid>
                <Grid item xs={7}>
                    <Grid container spacing={3} className="twitch-obs-detail">
                        <Grid item xs={12}>
                        {
                            selected_tab === 5
                            ? <iframe title="twitch-events" class="twitch-events" scrolling="no" src={config.twitch.events.iframe_src}/>
                            : <div class="twitch-events"/>
                        }
                        </Grid>
                        <Grid item xs={5}>
                            <Grid className="round-container" container spacing={0.2}>
                                {this.renderCurrentScene( current_scene )}
                                {this.renderItem( 'Streaming', streaming ) }
                                {this.renderItem( 'Boya Lavalier Mic', boya_lavalier_mic ) }
                                {this.renderItem( 'Elgato HD 60S+', elgato_hd_60s ) }
                                {this.renderItem( 'Blackhole', blackhole ) }

                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid className="round-container" container spacing={0.2}>
                                <Grid item xs={7}>Elapsed</Grid>        <Grid item xs={5}>{moment.utc(total_stream_time*1000).format('HH:mm:ss')}</Grid>
                                <Grid item xs={7}>CPU</Grid>            <Grid item xs={5}>{cpu_usage} %</Grid>
                                <Grid item xs={7}>FPS</Grid>            <Grid item xs={5}>{fps}</Grid>
                                <Grid item xs={7}>Dropped frames</Grid> <Grid item xs={5}>{num_dropped_frames * 100.0 / num_total_frames}</Grid>
                                <Grid item xs={7}>Missed frames</Grid>  <Grid item xs={5}>{(render_missed_frames * 100.0 / render_total_frames).toFixed(2)}</Grid>
                                <Grid item xs={7}>Strain</Grid>         <Grid item xs={5}>{strain}</Grid>

                            </Grid>
                        </Grid>

                        <Grid item xs={1}>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}


const mapStateToProps = state => {
    return {
        selected_tab         : state.dashboard.selected_tab,
        average_frame_time   : state.twitch.average_frame_time,
        blackhole            : state.twitch.blackhole,
        boya_lavalier_mic    : state.twitch.boya_lavalier_mic,
        bytes_per_sec        : state.twitch.bytes_per_sec,
        cpu_usage            : state.twitch.cpu_usage,
        current_scene        : state.twitch.current_scene,
        elgato_hd_60s        : state.twitch.elgato_hd_60s,
        fps                  : state.twitch.fps,
        kbits_per_sec        : state.twitch.kbits_per_sec,
        memory_usage         : state.twitch.memory_usage,
        num_dropped_frames   : state.twitch.num_dropped_frames,
        num_total_frames     : state.twitch.num_total_frames,
        output_skipped_frames: state.twitch.output_skipped_frames,
        output_total_frames  : state.twitch.output_total_frames,
        render_missed_frames : state.twitch.render_missed_frames,
        render_total_frames  : state.twitch.render_total_frames,
        strain               : state.twitch.strain,
        streaming            : state.twitch.streaming,
        total_stream_time    : state.twitch.total_stream_time,
    }
}

export default connect( mapStateToProps )( TwitchPanel );