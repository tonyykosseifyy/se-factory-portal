import React from 'react';
import './styles.scss';
import { Grid, Typography } from "@mui/material";
import { SE_GREEN } from "../../utils/constants/colors";
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
    return (
        <div className={"footer-wrapper"}>
            <div className={"footer-container"}>
                <Typography variant={"h5"} sx={{ color: "#FCFCFD" }}>
                    Reach out to Hire
                </Typography>
                <Typography variant={"body1"} sx={{ color: `${SE_GREEN} !important` }}>
                    <a href="mailto: hire@sefactory.io" style={{ color: `unset` }}>hire@sefactory.io</a>
                </Typography>
            </div>
        </div>
    );
};

export default Footer;