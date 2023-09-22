import React from "react";
import {
  Stack,
} from "@mui/material";
import Logo from "../../assets/core/SEF_logo_text.svg";
import "./styles.scss";
import LogoutButton from "../ui-components/LogoutButton";
import BootcampSelect from "../ui-components/NavbarSelect";


const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="https://sefactory.io/">
        <img className={"logo"} src={Logo} alt="logo" />
      </a>
      <Stack flexDirection="row" alignItems="stretch" mt={"-7px"}>

        <BootcampSelect />
        <LogoutButton />
      </Stack>

    </nav>
  );
};

export default Navbar;
