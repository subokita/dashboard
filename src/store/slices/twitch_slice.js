import { createSlice } from '@reduxjs/toolkit';

export const twitch_slice = createSlice({
    name        : 'twitch',
    initialState: {
        current_scene        : "N/A",
        blackhole            : false,
        at2020v_mic          : false,
        elgato_hd_60s        : false,

        at2020v_monitor      : false,
        at2020v_vst          : false,

        cpu_usage            : "0",
        fps                  : "0",
        memory_usage         : 0,

        average_frame_time   : 0,
        bytes_per_sec        : 0,
        kbits_per_sec        : 0,
        num_dropped_frames   : 0,
        num_total_frames     : 1,
        output_skipped_frames: 0,
        output_total_frames  : 1,
        render_skipped_frames: 0,
        render_total_frames  : 1,
        strain               : 0,
        streaming            : false,
        total_stream_time    : 0,
    },


    sampleState: {
        current_scene        : "Game Streaming",
        blackhole            : true,
        at2020v_mic          : false,
        elgato_hd_60s        : false,


        at2020v_monitor      : false,
        at2020v_vst          : false,

        cpu_usage            : "3.56",
        fps                  : "30.00",
        memory_usage         : 549.77,

        average_frame_time   : 13.64812,
        bytes_per_sec        : 286014,
        kbits_per_sec        : 2234,
        num_dropped_frames   : 0,
        num_total_frames     : 47879,
        output_skipped_frames: 0,
        output_total_frames  : 47885,
        render_skipped_frames: 213,
        render_total_frames  : 68628,
        strain               : 0,
        streaming            : true,
        total_stream_time    : 1595,
    },


    reducers    : {
        set_statistics: (state, action ) => {
            state.cpu_usage             = parseFloat( action.payload.cpuUsage ).toFixed(2);
            state.fps                   = parseFloat( action.payload.activeFps ).toFixed(2);
            state.memory_usage          = action.payload.memoryUsage.toFixed(2) ;
            state.average_frame_time    = parseFloat( action.payload.averageFrameRenderTime ).toFixed(2);

            // availableDiskSpace  Number  Available disk space on the device being used for recording storage
            // renderSkippedFrames Number  Number of frames skipped by OBS in the render thread
            // renderTotalFrames   Number  Total number of frames outputted by the render thread
            // outputSkippedFrames Number  Number of frames skipped by OBS in the output thread
            // outputTotalFrames   Number  Total number of frames outputted by the output thread
            // webSocketSessionIncomingMessages    Number  Total number of messages received by obs-websocket from the client
            // webSocketSessionOutgoingMessages    Number  Total number of messages sent by obs-websocket to the client
        },


        set_stream_status: ( state, action ) => {
            state.streaming             = action.payload.outputActive;
            state.total_stream_time     = action.payload.outputDuration;
            state.output_skipped_frames = action.payload.outputSkippedFrames;
            state.output_total_frames   = action.payload.outputTotalFrames;
            state.strain                = action.payload.outputCongestion;

            // outputReconnecting  Boolean Whether the output is currently reconnecting
            // outputTimecode  String  Current formatted timecode string for the output
            // outputBytes Number  Number of bytes sent by the output
        },


        set_at2020v_monitor: ( state, action ) => {
            state.at2020v_monitor = action.payload;
        },


        set_at2020v_vst: ( state, action ) => {
            state.at2020v_vst = action.payload;
        },

        // set_heartbeat_state: (state, action) => {
        //     state.streaming             = action.payload.streaming;
        //     state.total_stream_time     = action.payload.totalStreamTime;
        //     state.average_frame_time    = parseFloat( action.payload.averageFrameTime ).toFixed(2);
        //     state.bytes_per_sec         = action.payload.bytesPerSec;
        //     state.cpu_usage             = parseFloat( action.payload.cpuUsage ).toFixed(2);
        //     state.fps                   = parseFloat( action.payload.fps ).toFixed(2);
        //     state.memory_usage          = action.payload.memoryUsage.toFixed(2) ;
        //     state.kbits_per_sec         = action.payload.kbitsPerSec;
        //     state.num_dropped_frames    = action.payload.numDroppedFrames;
        //     state.num_total_frames      = action.payload.numTotalFrames;
        //     state.output_skipped_frames = action.payload.outputSkippedFrames;
        //     state.output_total_frames   = action.payload.outputTotalFrames;
        //     state.render_skipped_frames = action.payload.renderMissedFrames;
        //     state.render_total_frames   = action.payload.renderTotalFrames;
        //     state.strain                = action.payload.strain;
        // },

        set_disconnect_status: (state, action) => {
            state.at2020v_mic       = false;
            state.boya_lavalier_mic = false;
            state.elgato_hd_60s     = false;
            state.blackhole         = false;
            state.current_scene     = "N/A";
            state.streaming         = false;
        },


        set_at2020v_mic: (state, action) => {
            state.at2020v_mic = action.payload;
        },

        set_elgato_hd_60s: (state, action) => {
            state.elgato_hd_60s = action.payload;
        },

        set_blackhole: (state, action) => {
            state.blackhole = action.payload;
        },

        set_current_scene: (state, action) => {
            state.current_scene = action.payload;
        },
    }
})

export const { set_at2020v_mic, set_elgato_hd_60s, set_blackhole,
               set_current_scene, set_disconnect_status, set_statistics,
               set_stream_status, set_at2020v_monitor, set_at2020v_vst } = twitch_slice.actions
export default twitch_slice.reducer