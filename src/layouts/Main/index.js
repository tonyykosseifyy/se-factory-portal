import React from 'react';
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const Main = ({children}) => {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
};

export default Main;