import ReactDOM                        from 'react-dom';
import { Provider }                    from 'react-redux'
import store                           from './store/main.js'
import Dashboard                       from './dashboard.js'
import { createTheme, ThemeProvider }  from '@mui/material/styles';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MiniMusicPanel                  from './music/mini.js'

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route exact path='/' exact element={<Dashboard/>} />
                    <Route path='/music' element={<MiniMusicPanel/>} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </Provider>,
    document.getElementById( 'root' )
);