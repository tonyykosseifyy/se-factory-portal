import React, {useEffect} from "react";
import {Redirect, Route, useHistory, useLocation} from "react-router-dom";
// import VerifyEmail from "../../pages/VerifyEmail";
import Loader from "../../components/Loader";
import Cookies from 'js-cookie';
import {hooks} from "../../api";
import {AUTH_ROUTE, HIRING_PORTAL_ROUTE} from "../../utils/routes";
import {useAuth0} from "@auth0/auth0-react";

const AuthRoute = ({component: Component, ...args}) => {
    const {isLoading, isAuthenticated, loginWithRedirect, user} = useAuth0();
    const isLoggedIn = Cookies.get('se-token');
    // const { push } = useHistory();
    // console.log(isLoggedIn)
    const { data: dbUser, isLoading: isLoadingUser} = hooks.useCurrentUser();
    // // useEffect(() => {
    // //     if(user) {
    // //         portalAccessed({user})
    // //     }
    // // }, [user])


    return (<Route
        render={(props) => {

                if (Boolean(isLoggedIn)) {
                    if (dbUser) {
                        // if (user.email_verified) {
                            return <Component {...props}/>
                        // } else {
                        //     return <VerifyEmail/>
                        // }
                    }
                    else{
                        return <Loader SELogo/>
                    }
                } else {
                    window.location.href = (process.env.REACT_APP_API_HOST+'connect/auth0')
                    return (<Loader SELogo/>)
                }
        }}

        {...args}
    />)
};

export default AuthRoute;

