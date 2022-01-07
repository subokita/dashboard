import "../index.css"
import "./dictionary.css"
import React                 from 'react';
import config                from "../config.json"
import { Grid, Box, Avatar } from '@mui/material';
import { connect }           from 'react-redux'
import { out_of_range }      from '../common/utils.js'
import { set_translation }   from '../store/slices/dictionary_slice.js'
import WebSocketHelper       from '../common/websocket_helper.js';


class DictionaryPanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.dictionary.websocket.url, config.dictionary.websocket.poll_interval );
    }

    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            const data = JSON.parse( event.data );
            this.props.dispatch( set_translation( data ) );
        };
        this.ws_helper.start();
    }


    componentDidUpdate( prevProps ) {
        if ( this.props.selected_tab === this.props.index )
            this.ws_helper.resume();
        else
            this.ws_helper.pause();
    }


    render() {
        const { index, selected_tab, width,
                lang, word, definition } = this.props;

        if ( out_of_range( index, selected_tab ) )
            return (<Box sx={{ width: Number( width ), overflow: 'hidden' }}/>)

        return (
            <Box className="box" sx={{ width: Number( width ) }}>
                <Grid container className="dictionary-container" spacing={2}>
                    <Grid className="dictionary-word" item xs={4}>
                        <Avatar className="dictionary-flag" src={config.dictionary.flags[lang]}/>
                        {word}
                    </Grid>
                    <Grid className="dictionary-definition" item xs={8}>
                        <div dangerouslySetInnerHTML={{__html: definition}}/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}



const mapStateToProps = (state, ownProps) => {
    return {
        selected_tab: state.dashboard.selected_tab,
        lang        : state.dictionary.lang,
        word        : state.dictionary.word,
        definition  : state.dictionary.definition,
    }
}

export default connect( mapStateToProps )( DictionaryPanel );