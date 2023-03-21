import "../index.css"
import "./note.css"

import React            from 'react';
import { Grid, Box }    from '@mui/material';
import { connect }      from 'react-redux'
import { out_of_range } from '../common/utils.js'
import ReactMarkdown    from 'react-markdown';
import remarkGfm        from 'remark-gfm';
import column_1_md      from './column_1.md';
import column_2_md      from './column_2.md';
import column_3_md      from './column_3.md';
import { set_column_1,
         set_column_2,
         set_column_3 } from '../store/slices/note_slice.js'



class NotePanel extends React.Component {

    componentDidMount() {
        fetch( column_1_md )
        .then( response => response.text() )
        .then( text => this.props.dispatch( set_column_1( text )) )


        fetch( column_2_md )
        .then( response => response.text() )
        .then( text => this.props.dispatch( set_column_2( text )) )


        fetch( column_3_md )
        .then( response => response.text() )
        .then( text => this.props.dispatch( set_column_3( text )) )
    }

    render() {
        const { index, selected_tab, width, column_1, column_2, column_3 } = this.props;

        if ( out_of_range( index, selected_tab ) )
            return (<Box sx={{ width: Number( width ), overflow: 'hidden' }}/>)


        return (
            <Box className="box note-box" sx={{ width: Number( this.props.width ) }}>
                <Grid container spacing={3} sx={{ paddingLeft: 5 }}>
                    <Grid item xs={4} className="paper note-column">
                        <ReactMarkdown className="note-markdown">
                            {column_1}
                        </ReactMarkdown>
                    </Grid>
                    <Grid item xs={4} className="paper note-column">
                        <ReactMarkdown className="note-markdown" remarkPlugins={[remarkGfm]}>
                            {column_2}
                        </ReactMarkdown>
                    </Grid>
                    <Grid item xs={4} className="paper note-column">
                        <ReactMarkdown className="note-markdown" remarkPlugins={[remarkGfm]}>
                            {column_3}
                        </ReactMarkdown>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        selected_tab: state.dashboard.selected_tab,
        column_1    : state.note.column_1,
        column_2    : state.note.column_2,
        column_3    : state.note.column_3,
    }
}

export default connect( mapStateToProps )( NotePanel );