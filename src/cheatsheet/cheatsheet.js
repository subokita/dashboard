import "../index.css"
import "./cheatsheet.css"
import React          from 'react';
import { Box }        from '@mui/material';
import Table          from '@mui/material/Table';
import TableBody      from '@mui/material/TableBody';
import TableCell      from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead      from '@mui/material/TableHead';
import TableRow       from '@mui/material/TableRow';


class CheatsheetPanel extends React.Component {
    render() {
        return (
            <Box className="box cheatsheet-box" sx={{ width: Number( this.props.width ) }}>
                <TableContainer className="cheatsheet-table-container">
                    <Table stickyHeader className="cheatsheet-table">
                        <TableHead>
                            <TableRow>
                                {
                                    this.props.headers.map((header) => (
                                        <TableCell className="cheatsheet-table-header">{header}</TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.rows.map((row, row_index) => (
                                    <TableRow key={row_index} className={ row_index % 2 === 0 ? "cheatsheet-table-row-even" : "cheatsheet-table-row-odd" }>
                                        {
                                            row.map(( entry, entry_index ) => (
                                                entry_index === 0 ?
                                                    <TableCell className="cheatsheet-table-cell" component="th" scope="row">{entry}</TableCell> :
                                                    <TableCell className="cheatsheet-table-cell">{entry}</TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }
}

CheatsheetPanel.defaultProps = {
    headers: [],
    rows   : []
}

export default CheatsheetPanel;