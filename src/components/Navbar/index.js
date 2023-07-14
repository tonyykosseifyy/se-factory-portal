import React, { useState } from 'react';
import {
    AppBar,
    Box, Grid,
    List,
    ListItem,
    ListItemText,
    SwipeableDrawer,
    Stack, Typography,
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
import LogoutButton from '../LogoutButton';

const Navbar = () => {

    const isLoggedIn = Cookies.get('se-token');
    const { logout } = useAuth0();
    const { isGod, handlePreRelease, preRelease } = useGodMode()
    const { push } = useHistory()
    const theme = useTheme();


    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <nav className='navbar'>
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
            <Stack flexDirection='row' alignItems='stretch'>
                {/* {Boolean(isLoggedIn) && (
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
                )} */}
                <LogoutButton />
            </Stack>
                
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
        </nav>

    )
};

export default Navbar;
