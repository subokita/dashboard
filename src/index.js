import ReactDOM                       from 'react-dom';
import Dashboard                      from './dashboard.js'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Dashboard/>
    </ThemeProvider>,
    document.getElementById( 'root' )
);