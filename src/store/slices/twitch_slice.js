import { createSlice } from '@reduxjs/toolkit';

export const twitch_slice = createSlice({
    name        : 'twitch',
    initialState: {
        average_frame_time   : 0,
        blackhole            : false,
        boya_lavalier_mic    : false,
        bytes_per_sec        : 0,
        cpu_usage            : "0",
        current_scene        : "N/A",
        elgato_hd_60s        : false,
        fps                  : "0",
        kbits_per_sec        : 0,
        memory_usage         : 0,
        num_dropped_frames   : 0,
        num_total_frames     : 1,
        output_skipped_frames: 0,
        output_total_frames  : 1,
        render_missed_frames : 0,
        render_total_frames  : 1,
        strain               : 0,
        streaming            : false,
        total_stream_time    : 0,
    },


    sampleState: {
        average_frame_time   : 13.64812,
        blackhole            : true,
        boya_lavalier_mic    : false,
        bytes_per_sec        : 286014,
        cpu_usage            : "3.56",
        current_scene        : "Game Streaming",
        elgato_hd_60s        : false,
        fps                  : "30.00",
        kbits_per_sec        : 2234,
        memory_usage         : 549.77734375,
        num_dropped_frames   : 0,
        num_total_frames     : 47879,
        output_skipped_frames: 0,
        output_total_frames  : 47885,
        render_missed_frames : 213,
        render_total_frames  : 68628,
        strain               : 0,
        streaming            : true,
        total_stream_time    : 1595,
    },


    reducers    : {
        set_heartbeat_state: (state, action) => {
            state.streaming             = action.payload.streaming;
            state.total_stream_time     = action.payload.totalStreamTime;
            state.average_frame_time    = parseFloat( action.payload.averageFrameTime ).toFixed(2);
            state.bytes_per_sec         = action.payload.bytesPerSec;
            state.cpu_usage             = parseFloat( action.payload.cpuUsage ).toFixed(2);
            state.fps                   = parseFloat( action.payload.fps ).toFixed(2);
            state.memory_usage          = action.payload.memoryUsage.toFixed(2) ;
            state.kbits_per_sec         = action.payload.kbitsPerSec;
            state.num_dropped_frames    = action.payload.numDroppedFrames;
            state.num_total_frames      = action.payload.numTotalFrames;
            state.output_skipped_frames = action.payload.outputSkippedFrames;
            state.output_total_frames   = action.payload.outputTotalFrames;
            state.render_missed_frames  = action.payload.renderMissedFrames;
            state.render_total_frames   = action.payload.renderTotalFrames;
            state.strain                = action.payload.strain;
        },

        set_boya_lavalier_mic: (state, action) => {
            state.boya_lavalier_mic = action.payload;
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

export const { set_heartbeat_state, set_boya_lavalier_mic,
               set_elgato_hd_60s, set_blackhole, set_current_scene } = twitch_slice.actions
export default twitch_slice.reducer