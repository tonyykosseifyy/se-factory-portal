import React from 'react';
import ReactDOM from 'react-dom';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import ModalProvider from 'mui-modal-provider';
import {BrowserRouter as Router} from "react-router-dom";
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {SE_LIGHT_GREY, SE_GREEN} from "./utils/constants/colors";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import mixpanel from 'mixpanel-browser';
import {CssBaseline} from "@mui/material";
import AxiosProvider from "./context/axios";
import {queryClient, QueryClientProvider, ReactQueryDevtools} from "./api";
import {GodModeProvider} from "./context/godMode";



const Theme = createTheme({
    palette: {
        primary: {
            main: SE_GREEN,
        },
        secondary: {
            main: SE_LIGHT_GREY
        },
        tertiary: {
            main: '#FB508E', 
        },
        quaternary: {
            main: '#9864DA',
        },
    },
    typography: {
        fontFamily: 'Noto Sans Mono, monospace' 
    },});

mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN,  {debug: process.env.REACT_APP_ENV === "development"})

ReactDOM.render(
    <Router>
        <Auth0ProviderWithHistory>
            <AxiosProvider>

                    <QueryClientProvider client={queryClient}>
                        <GodModeProvider>

                        {
                            process.env.REACT_APP_ENV!=="production"
                            &&
                            <ReactQueryDevtools initialIsOpen/>

                        }
                        <ThemeProvider theme={Theme}>
                            <CssBaseline/>
                            <ModalProvider>
                                <App />
                            </ModalProvider>
                        </ThemeProvider>
            </GodModeProvider>

            </QueryClientProvider>

            </AxiosProvider>

        </Auth0ProviderWithHistory>
    </Router>
        ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
