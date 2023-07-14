import React from 'react'
import './index.scss';
import Cookies from 'js-cookie';
import { useAuth0 } from "@auth0/auth0-react";


const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <div onClick={() => {
      logout();
      Cookies.remove('se-token');
    }} 
      className='logout_outer'>
      <div className='logout_inner'>LOGOUT</div>
    </div>
  )
}

export default LogoutButton; 