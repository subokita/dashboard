import "../index.css"
import "./cheatsheet.css"
import cheatsheets                    from '../cheatsheets.json'
import React                          from 'react';
import { connect }                    from 'react-redux'
import config                         from "../config.json"
import WebSocketHelper                from '../common/websocket_helper.js';
import ReactMarkdown                  from 'react-markdown';
import remarkGfm                      from 'remark-gfm';
import { Box, Avatar }                from '@mui/material';
import { set_selected, set_markdown } from '../store/slices/cheatsheet_slice.js'

import czech_md          from './markdowns/czech.md'
import hebrew_md         from './markdowns/hebrew.md'
import swahili_md        from './markdowns/swahili.md'
import solvespace_md     from './markdowns/solvespace.md'
import scummvm_md        from './markdowns/scummvm.md'
import rubiks_md         from './markdowns/rubiks.md'
import ultimaker_cura_md from './markdowns/ultimaker_cura.md'
import blender_md        from './markdowns/blender.md'
import stenography_md    from './markdowns/stenography.md'
import pixelmator_md     from './markdowns/pixelmator.md'



class CheatsheetPanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.cheatsheet.websocket.url, config.cheatsheet.websocket.poll_interval );

        this.icon_mapping = {};
        cheatsheets.items.forEach( (item) => {
            this.icon_mapping[item.uid] = <Avatar className="cheatsheet-icon" src={item.icon.path.replace( '~/dashboard/public/', '' )}/>;
        });

        this.markdown_mapping = {
            'czech'      : czech_md,
            'hebrew'     : hebrew_md,
            'swahili'    : swahili_md,
            'solvespace' : solvespace_md,
            'scummvm'    : scummvm_md,
            'rubiks'     : rubiks_md,
            'cura'       : ultimaker_cura_md,
            'blender'    : blender_md,
            'stenography': stenography_md,
            'pixelmator' : pixelmator_md,
        }
    }

    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            if ( this.props.selected !== event.data ) {
                this.props.dispatch( set_selected( event.data ));

                fetch( this.markdown_mapping[event.data] )
                .then( response => response.text() )
                .then( text => this.props.dispatch( set_markdown( text )) )
            }
        };

        this.ws_helper.start();
    }

    render() {
        const { selected, markdown } = this.props;

        return (
            <Box className="box cheatsheet-box" sx={{ width: Number( this.props.width ) }}>
                {this.icon_mapping[selected]}
                <ReactMarkdown className="cheatsheet-markdown" remarkPlugins={[remarkGfm]}>
                    {markdown}
                </ReactMarkdown>
            </Box>
        );
    }
}


const mapStateToProps = state => {
    return {
        selected: state.cheatsheet.selected,
        markdown: state.cheatsheet.markdown,
    }
}

export default connect( mapStateToProps )( CheatsheetPanel );