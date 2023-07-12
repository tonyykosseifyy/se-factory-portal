import React, { useState } from 'react';
import {
    AppBar,
    Box, Grid,
    List,
    ListItem,
    ListItemText,
    SwipeableDrawer,
    Toolbar, Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import Logo from '../../assets/core/SEF_logo_text.svg';
import MenuIcon from '@mui/icons-material/Menu';
import './styles.scss';
import SEButton from "../SEButton";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from 'js-cookie';
import { queryClient } from "../../api";
import { CURRENT_USER_KEY } from "../../api/config/keys";
import { useHistory } from "react-router-dom";
import { useGodMode } from "../../context/godMode";

const Navbar = () => {

    const isLoggedIn = Cookies.get('se-token');
    const { logout } = useAuth0();
    const { isGod, handlePreRelease, preRelease } = useGodMode()
    const [open, setOpen] = useState(false);
    const { push } = useHistory()
    const theme = useTheme();


    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDrawer = (openE) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setOpen(openE)
    };
    return (
        <Box>
            <Toolbar sx={{
                display: 'flex',
                justifyContent: "center",
                alignItems: 'center',
                padding: '0.5% 10vh !important',
                width: '100%',
                backgroundColor: '#363738',
            }}>

                <div className='toolbar-elements'>
                    <a href="https://sefactory.io/">
                        <img
                            className={"logo"}
                            src={Logo}
                            height={80}
                            width={200}
                            alt="logo"
                            style={{ pointerEvents: "all", cursor: 'pointer' }}
                        />
                    </a>
                    {Boolean(isLoggedIn) && (
                        <SEButton
                            variant={"contained"}
                            sx={{ backgroundColor: "#FB4747", color: "#FCFCFD" }}
                            onClick={() => {
                                Cookies.remove('se-token');
                                logout();
                            }}
                        >
                            Logout
                        </SEButton>
                    )}
                </div>




                {/* {isGod && (
                    <SEButton
                        onClick={handlePreRelease}
                        variant={"outlined"}
                        color={"secondary"}
                        style={{ marginRight: 10 }}

                    >
                        {!preRelease ? 'UnRelease' : 'Release'}
                    </SEButton>
                )} */}


            </Toolbar>

            <AppBar position="static" className="header">

            </AppBar>

        </Box>

    )
};

export default Navbar;
