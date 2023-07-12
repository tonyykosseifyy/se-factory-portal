import React, {useEffect} from 'react';
import {useAuth0} from "@auth0/auth0-react";
import {hooks} from "../../api";


const GodModeContext = React.createContext(null)


export const GodModeProvider = ({children}) => {

    // for full release of the details set the initial value to false
    const [preRelease,setPreRelease] = React.useState(false);

    const [isGod,setIsGod] = React.useState(false);

    const { data: user } = hooks.useCurrentUser();

    useEffect(() => {
        if(user){
            setIsGod(user.email.endsWith("@sefactory.io"))
        }
    },[user])

    const handlePreRelease = () => {
        if(isGod) {
            setPreRelease(!preRelease);
        }
    }

    return (
        <GodModeContext.Provider value={{
            preRelease,
            handlePreRelease,
            isGod
        }}>
            {children}
        </GodModeContext.Provider>
    )
}

export const useGodMode = () => {
    const context = React.useContext(GodModeContext)
    if (!context) {
        throw new Error('useGodMode must be used within a GodModeProvider')
    }
    return context
}
