import "../index.css"
import "./cheatsheet.css"
import czech           from './czech.json'
import React           from 'react';
import CheatsheetPanel from './cheatsheet.js'

class CzechPanel extends React.Component {
    render() {
        return(
            <CheatsheetPanel headers={czech.headers} rows={czech.rows}/>
        );
    }
}


export default CzechPanel;