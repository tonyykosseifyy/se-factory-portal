import React from 'react';
import {CircularProgress} from "@mui/material";
import './styles.scss';

const Loader = ({SELogo = false, height = 'calc(100vh - 74px)'}) => {
    return (
        <div style={{height, width: '100%', display: 'flex', placeContent: "center", placeItems: 'center'}}>
            {
                SELogo ?

                    <div className="loading-spinner" />
                    :

                    <CircularProgress sx={{margin: 'auto'}}/>
            }
        </div>
    );
};

export default Loader;