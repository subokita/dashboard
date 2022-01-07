import "../index.css"
import "./todo.css"

import { connect }      from 'react-redux'
import React            from 'react';
import { Box, Grid }    from '@mui/material';
import config           from "../config.json"
import { set_today }    from '../store/slices/todo_slice.js'
import { out_of_range } from '../common/utils.js'
import WebSocketHelper  from '../common/websocket_helper.js';

class TodoPanel extends React.Component {
    constructor( props ){
        super( props );
        this.ws_helper = new WebSocketHelper( config.todo.websocket.url, config.todo.websocket.poll_interval );
    }


    componentDidMount() {
        this.ws_helper.onMessage = (event) => {
            const info = JSON.parse( event.data );
            this.props.dispatch( set_today( info ));
        };

        this.ws_helper.start();
    }


    componentDidUpdate( prevProps ) {
        if ( this.props.selected_tab === this.props.index )
            this.ws_helper.resume();
        else
            this.ws_helper.pause();
    }


    renderHeading( heading, items, heading_index ) {
        const selector = {
            class_name: {
                completed : 'paper todo-entry todo-entry-done',
                canceled  : 'paper todo-entry todo-entry-done',
                incomplete: 'paper todo-entry todo-entry-pending',
            },
            tick: {
                completed : <span className="todo-tick">🟢 </span>,
                canceled  : <span className="todo-tick">🚸 </span>,
                incomplete: <span className="todo-tick">⭕️ </span>,
            }
        }

        return (
            <Grid container spacing={0} key={heading_index}>
                {
                    heading === 'null'
                            ?   ""
                            :   <Grid className="paper todo-entry todo-heading" item xs={12}>
                                    {heading}
                                </Grid>
                }
                {
                    items.map( (item, index) => (
                        <Grid className={selector.class_name[item.status]} item xs={12} key={index}>
                            {selector.tick[item.status]}
                            {item.title}
                        </Grid>
                    ))
                }
            </Grid>
        )
    }

    renderProject( project, headings, project_index ) {
        return (
            <Grid item xs={4} key={project_index}>
                <Grid container spacing={0} className="todo-container">
                    {
                        project === 'null'
                                ?   ""
                                :   <Grid className="paper todo-entry todo-project" item xs={12}>
                                        {project}
                                    </Grid>
                    }
                    {
                        Object.entries( headings ).map( ([heading, items], heading_index) => (
                            this.renderHeading( heading, items, heading_index )
                        ))
                    }
                </Grid>
            </Grid>
        )

    }


    render() {
        const { selected_tab, today, index, width } = this.props;

        if ( out_of_range( index, selected_tab ) )
            return (<Box sx={{ width: Number( width ), overflow: 'hidden' }}/>)

        return (
            <Box className="box" sx={{ width: Number( this.props.width ) }}>
                <Grid className="todo-main-container" container spacing={4}>
                    {
                        Object.entries( today ).map( ([project, headings], project_index) => (
                            this.renderProject( project, headings, project_index )
                        ))
                    }
                </Grid>
            </Box>
        );
    }
}


const mapStateToProps = state => {
    return {
        selected_tab: state.dashboard.selected_tab,
        today       : state.todo.today,
    }
}

export default connect( mapStateToProps )( TodoPanel );