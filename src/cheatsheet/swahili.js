import "../index.css"
import "./cheatsheet.css"
import swahili         from './swahili.json'
import React           from 'react';
import CheatsheetPanel from './cheatsheet.js'

class SwahiliPanel extends React.Component {
    render() {
        return(
            <CheatsheetPanel headers={swahili.headers} rows={swahili.rows}/>
        );
    }
}


export default SwahiliPanel;