import React, {useEffect} from 'react';
import './styles.scss';
import {Typography} from "@mui/material";
import SEButton from "../../components/SEButton";
import {useAuth0} from "@auth0/auth0-react";
import {useHistory} from "react-router-dom";
import {HIRING_PORTAL_ROUTE} from "../../utils/routes";
import Loader from "../../components/Loader";

const WelcomeScreen = () => {

    const { loginWithRedirect, user, isLoading } = useAuth0()
    const history = useHistory();

    useEffect(() => {
        if(user){
            history.push(HIRING_PORTAL_ROUTE.path)
        }
    },[user])

    if(isLoading){
        return <Loader SELogo/>
    }

    return (
        <div className={"welcome-container"}>
            <div className={"login-container"}>
                <Typography variant={"h4"}>
                    Welcome to SE Hiring Portal
                </Typography>

                <SEButton variant={"contained"} className={"access-button"} onClick={loginWithRedirect}>
                    Access the Portal
                </SEButton>
            </div>

        </div>
    );
};

export default WelcomeScreen;