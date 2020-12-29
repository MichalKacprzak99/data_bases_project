import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import { Button} from './LogoutPage.css';
const LogoutPage = () => {
    const [isLogin, setLogin] = useState(true)

    const handleLogout = () => {
      
      localStorage.setItem('isLogged', 'false');
      localStorage.setItem('token', 'null');
      window.dispatchEvent( new Event('storage') );
      setLogin(false)

    }
    return (
    <>
      <Button type="button" onClick={handleLogout}>Logout</Button>  
      { !isLogin ? <Redirect to="/" /> : null  }    
    </> 
    )
}
export default LogoutPage;