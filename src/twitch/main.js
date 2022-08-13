import "../index.css"
import "./twitch.css"

import moment       from 'moment';
import { connect }  from 'react-redux'
import config       from "../config.json"
import OBSWebSocket from 'obs-websocket-js';
import React        from 'react';
import { Grid }     from '@mui/material';
import { set_heartbeat_state, set_at2020v_mic,
         set_elgato_hd_60s, set_blackhole,
         set_current_scene, disconnect } from '../store/slices/twitch_slice.js'
import { out_of_range }     from '../common/utils.js'

class TwitchPanel extends React.Component {
    constructor( props ){
        super( props );
        this.obs = new OBSWebSocket();
    }


    componentDidUpdate( prevProps ) {
        if ( this.props.selected_tab === this.props.index ) {
            this.connect();
        }
        else {
            this.obs.disconnect();
            this.props.dispatch( disconnect() );
        }
    }

    async connect() {
        const { dispatch } = this.props;

        try{
            await this.obs.connect({address: config.twitch.obs.websocket.url});

            this.obs.on('error', err => {
                console.error('socket error:', err);
                dispatch( disconnect() );
            });

            this.obs.on( 'SwitchScenes', data => dispatch( set_current_scene( data.sceneName )) );
            this.obs.on( 'StreamStatus', data => dispatch( set_heartbeat_state( data ) ) );

            this.obs.on( 'SourceMuteStateChanged', data => {
                switch( data.sourceName ) {
                    case 'AT2020V Mic'        : dispatch( set_at2020v_mic      ( !data.muted ) ); break;
                    // case 'Boya Lavalier Mic'  : dispatch( set_boya_lavalier_mic( !data.muted ) ); break;
                    case 'Blackhole 16ch'     : dispatch( set_blackhole        ( !data.muted ) ); break;
                    case 'Elgato HD60S+ Audio': dispatch( set_elgato_hd_60s    ( !data.muted ) ); break;
                    default: break;
                }
            })

            let data = await this.obs.send('GetCurrentScene');
            dispatch( set_current_scene( data.name ));

            this.obs.send( 'GetMute', { source: 'AT2020V Mic'         } ).then( data => dispatch( set_at2020v_mic      ( !data.muted ) ) );
            // this.obs.send( 'GetMute', { source: 'Boya Lavalier Mic'   } ).then( data => dispatch( set_boya_lavalier_mic( !data.muted ) ) );
            this.obs.send( 'GetMute', { source: 'Blackhole 16ch'      } ).then( data => dispatch( set_blackhole        ( !data.muted ) ) );
            this.obs.send( 'GetMute', { source: 'Elgato HD60S+ Audio' } ).then( data => dispatch( set_elgato_hd_60s    ( !data.muted ) ) );

        }
        catch ( err ) {
            console.error('socket error:', err);
            dispatch( disconnect() );
        }
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
            case 'Just Chatting':
                return <Grid item xs={12} className="twitch-scene twitch-scene-streaming">{current_scene}</Grid>
            case 'Break':
                return <Grid item xs={12} className="twitch-scene twitch-scene-break">{current_scene}</Grid>
            default:
                return <Grid item xs={12} className="twitch-scene twitch-scene-others">{current_scene}</Grid>
        }
    }

    render() {
        const { streaming, at2020v_mic, elgato_hd_60s, blackhole,
                total_stream_time, cpu_usage, fps, num_dropped_frames,
                num_total_frames, render_missed_frames, render_total_frames,
                strain, current_scene, selected_tab, index } = this.props;

        if ( out_of_range( index, selected_tab ) )
            return (<Grid container spacing={0} sx={{ padding: 3 }}/>)


        return (
            <Grid container spacing={0} sx={{ padding: 3 }}>
                <Grid item xs={5} >
                    <iframe title="twitch-chat" className="twitch-chat" scrolling="no" src={config.twitch.chat.iframe_src}/>
                </Grid>
                <Grid item xs={7}>
                    <Grid container spacing={3} className="twitch-obs-detail">
                        <Grid item xs={12}>
                            <iframe title="twitch-events" className="twitch-events" scrolling="no" src={config.twitch.events.iframe_src}/>
                        </Grid>
                        <Grid item xs={5}>
                            <Grid className="round-container" container spacing={0.2}>
                                {this.renderCurrentScene( current_scene )}
                                {this.renderItem( 'Streaming', streaming ) }
                                {this.renderItem( 'AT2020V Mic', at2020v_mic ) }
                                {this.renderItem( 'Elgato HD 60S+', elgato_hd_60s ) }
                                {this.renderItem( 'Blackhole', blackhole ) }

                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid className="round-container" container spacing={0.2}>
                                <Grid item xs={7}>Elapsed</Grid>        <Grid item xs={5}>{moment.utc(total_stream_time*1000).format('HH:mm:ss')}</Grid>
                                <Grid item xs={7}>CPU</Grid>            <Grid item xs={5}>{cpu_usage} %</Grid>
                                <Grid item xs={7}>FPS</Grid>            <Grid item xs={5}>{fps}</Grid>
                                <Grid item xs={7}>Dropped frames</Grid> <Grid item xs={5}>{(num_dropped_frames * 100.0 / num_total_frames).toFixed(2)}</Grid>
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
        at2020v_mic          : state.twitch.at2020v_mic,
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