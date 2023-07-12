import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import {queryClient} from "../../api";
import {CURRENT_USER_KEY} from "../../api/config/keys";
import {Typography} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";

const backendUrl = process.env.REACT_APP_API_HOST;

const LoginRedirect = (props) => {
    const [text, setText] = useState('');
    const { logout } = useAuth0()
    const location = useLocation();
    const params = useParams();
    const history = useHistory();

    useEffect(() => {
        // Successfully logged with the provider
        // Now logging with strapi by using the access_token (given by the provider) in props.location.search
        fetch(`${backendUrl}auth/${params.providerName}/callback${location.search}`)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
                }
                return res;
            })
            .then(res => res.json())
            .then(res => {
                // Successfully logged with Strapi
                // Now saving the jwt to use it for future authenticated requests to Strapi
                Cookies.set('se-token',  res.jwt)
                queryClient.setQueryData(CURRENT_USER_KEY,res.user)
                setTimeout(() => history.push('/'), 3000); // Redirect to homepage after 3 sec
            })
            .catch(err => {
                console.log(err);
                setText('You are not allowed to enter the portal, please sign in with another email')
                setTimeout(() => logout(), 4000); // Redirect to homepage after 3 sec

            });
    }, [history, location.search, params.providerName]);

    if(text){
       return (
        <div style={{ display:'flex', placeContent:'center', placeItems:'center'}}>
            <Typography textAlign={"center"}>
                You are not allowed to enter the portal, you will be redirected to the login screen
            </Typography>
        </div>)
    }
    return (
        <Loader SELogo />
    )
};

export default LoginRedirect;