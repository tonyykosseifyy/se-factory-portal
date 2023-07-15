import React from 'react';
import { Button } from "@mui/material";
import './styles.scss';

const SEButton = ({ children, ...props }) => {
    return (
        <Button className='se-button' sx={{color: "#363738"}}
            style={{ borderRadius: '0px !important' }}
            {...props}>
            {children}
        </Button>
    );
};

export default SEButton;