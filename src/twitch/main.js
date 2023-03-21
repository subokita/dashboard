import "../index.css"
import "./twitch.css"
import Timer        from 'tiny-timer'
import moment       from 'moment';
import { connect }  from 'react-redux'
import config       from "../config.json"
import OBSWebSocket from 'obs-websocket-js';
import React        from 'react';
import { Grid }     from '@mui/material';
import { set_at2020v_mic, set_elgato_hd_60s, set_blackhole,
         set_current_scene, set_disconnect_status, set_statistics,
         set_stream_status, set_at2020v_monitor, set_at2020v_vst } from '../store/slices/twitch_slice.js'
import { out_of_range }     from '../common/utils.js'

class TwitchPanel extends React.Component {
    constructor( props ){
        super( props );
        this.obs   = new OBSWebSocket();
        this.timer = new Timer()
        this.timer.on( 'tick', (ms) => this.poll() );
    }


    componentDidUpdate( prevProps ) {
        if ( this.props.selected_tab === this.props.index ) {
            this.connect();
        }
        else {
            this.disconnect();
            this.props.dispatch( set_disconnect_status() );
        }
    }

    async connect() {
        const { dispatch } = this.props;


        try{
            await this.obs.connect( config.twitch.obs.websocket.url, config.twitch.obs.websocket.password );

            this.obs.on('error', err => {
                console.error('socket error:', err);
                this.disconnect();
                dispatch( set_disconnect_status() );
            });


            this.obs.on( 'CurrentProgramSceneChanged',  data => dispatch( set_current_scene( data.sceneName ) ));
            this.obs.on( 'InputMuteStateChanged', data => {
                switch( data.inputName ) {
                    case 'AT2020V Mic'        : dispatch( set_at2020v_mic      ( !data.inputMuted ) ); break;
                    case 'Blackhole 16ch'     : dispatch( set_blackhole        ( !data.inputMuted ) ); break;
                    case 'Elgato HD60S+ Audio': dispatch( set_elgato_hd_60s    ( !data.inputMuted ) ); break;
                    default: break;
                }
            });


            this.obs.on( 'InputAudioMonitorTypeChanged', data => {
                if( data.inputName === 'AT2020V Mic' )
                    dispatch( set_at2020v_monitor( data.monitorType === 'OBS_MONITORING_TYPE_MONITOR_AND_OUTPUT' ) )
            });

            this.obs.on( 'SourceFilterEnableStateChanged', data => {
                if( data.sourceName === 'AT2020V Mic' && data.filterName === 'VST 2.x Plug-in' )
                    dispatch( set_at2020v_vst( data.filterEnabled ) )
            });


            this.obs.call( 'GetCurrentProgramScene'                                 ).then( data => dispatch( set_current_scene( data.currentProgramSceneName ) ) );
            this.obs.call( 'GetInputMute', { inputName: 'AT2020V Mic'         }     ).then( data => dispatch( set_at2020v_mic   ( !data.inputMuted ) ) );
            this.obs.call( 'GetInputMute', { inputName: 'Blackhole 16ch'      }     ).then( data => dispatch( set_blackhole     ( !data.inputMuted ) ) );
            this.obs.call( 'GetInputMute', { inputName: 'Elgato HD60S+ Audio' }     ).then( data => dispatch( set_elgato_hd_60s ( !data.inputMuted ) ) );

            this.obs.call( 'GetInputAudioMonitorType', { inputName: 'AT2020V Mic' } )
                    .then( data => dispatch( set_at2020v_monitor( data.monitorType === 'OBS_MONITORING_TYPE_MONITOR_AND_OUTPUT' ) ) );

            this.obs.call( 'GetSourceFilter', { sourceName: 'AT2020V Mic', filterName: 'VST 2.x Plug-in' } )
                    .then( data => dispatch( set_at2020v_vst( data.filterEnabled ) ) );


            this.timer.start({ interval: config.twitch.obs.websocket.poll_interval, stopwatch: false })
        }
        catch ( err ) {
            console.error('socket error:', err);
            this.disconnect();
            dispatch( set_disconnect_status() );
        }
    }


    async disconnect() {
        const { dispatch } = this.props;
        this.timer.stop();
        dispatch( set_disconnect_status() );
        await this.obs.disconnect();
    }

    async poll() {
        const { dispatch } = this.props;
        this.obs.call( 'GetStats'        ).then( data => dispatch( set_statistics( data ) ) );
        this.obs.call( 'GetStreamStatus' ).then( data => dispatch( set_stream_status( data ) ) );
    }

    componentWillUnmount() {
        this.disconnect()
    }


    renderItem( name, status, monitor, vst ) {
        const class_name = status ? 'twitch-status-on': 'twitch-status-off';

        return(<>
            <Grid item xs={2} className={class_name}>●</Grid>
            <Grid item xs={10}>
               {name} {monitor ? <img className="vpn" src="icons8-listening_skin_type_1.png"/> : "" } {vst ? <img className="vpn" src="icons8-phone.png"/> : "" }
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
        const { streaming, at2020v_mic, elgato_hd_60s, blackhole, at2020v_monitor, at2020v_vst,
                total_stream_time, cpu_usage, fps, num_dropped_frames, memory_usage,
                num_total_frames, render_skipped_frames, render_total_frames,
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
                                {this.renderItem( 'AT2020V Mic', at2020v_mic, at2020v_monitor, at2020v_vst ) }
                                {this.renderItem( 'Elgato HD 60S+', elgato_hd_60s ) }
                                {this.renderItem( 'Blackhole', blackhole ) }

                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid className="round-container" container spacing={0.2}>
                                {/*<Grid item xs={7}>Elapsed</Grid>        <Grid item xs={5}>{moment.utc(total_stream_time*1000).format('HH:mm:ss')}</Grid>*/}
                                <Grid item xs={7}>Elapsed</Grid>        <Grid item xs={5}>{total_stream_time}</Grid>
                                <Grid item xs={7}>CPU</Grid>            <Grid item xs={5}>{cpu_usage} %</Grid>
                                <Grid item xs={7}>RAM</Grid>            <Grid item xs={5}>{memory_usage} MB</Grid>
                                <Grid item xs={7}>FPS</Grid>            <Grid item xs={5}>{fps}</Grid>
                                <Grid item xs={7}>Dropped frames</Grid> <Grid item xs={5}>{(num_dropped_frames * 100.0 / num_total_frames).toFixed(2)}</Grid>
                                <Grid item xs={7}>Skipped frames</Grid> <Grid item xs={5}>{(render_skipped_frames * 100.0 / render_total_frames).toFixed(2)}</Grid>
                                {/*<Grid item xs={7}>Strain</Grid>         <Grid item xs={5}>{strain}</Grid>*/}

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
        at2020v_monitor      : state.twitch.at2020v_monitor,
        at2020v_vst          : state.twitch.at2020v_vst,
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
        render_skipped_frames: state.twitch.render_skipped_frames,
        render_total_frames  : state.twitch.render_total_frames,
        strain               : state.twitch.strain,
        streaming            : state.twitch.streaming,
        total_stream_time    : state.twitch.total_stream_time,
    }
}

export default connect( mapStateToProps )( TwitchPanel );