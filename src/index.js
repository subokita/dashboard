import ReactDOM                       from 'react-dom';
import { Provider }                   from 'react-redux'
import store                          from './store/main.js'
import Dashboard                      from './dashboard.js'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <Dashboard/>
        </ThemeProvider>
    </Provider>,
    document.getElementById( 'root' )
);