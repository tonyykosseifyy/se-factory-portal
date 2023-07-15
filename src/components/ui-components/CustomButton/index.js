import React from 'react';
import { Button } from "@mui/material";
import './styles.scss';

const CustomButton = ({ children,className, ...props }) => {
    return (
        <Button className={className} sx={{color: "#363738"}} style={{ borderRadius: '0px !important' }} {...props}>
            {children}
        </Button>
    );
};

export default CustomButton;