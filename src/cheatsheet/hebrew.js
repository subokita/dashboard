import "../index.css"
import "./cheatsheet.css"
import hebrew          from './hebrew.json'
import React           from 'react';
import CheatsheetPanel from './cheatsheet.js'

class HebrewPanel extends React.Component {
    render() {
        return(
            <CheatsheetPanel headers={hebrew.headers} rows={hebrew.rows}/>
        );
    }
}


export default HebrewPanel;