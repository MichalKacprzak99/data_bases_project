import React, {useState, useEffect} from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import {AdminLoginPage, AdminInterface} from './components'
const AdminPage = () => {
  const location = useLocation();
  return (
    <>      
    {localStorage.getItem('isAdminLogged')==='true'? <AdminInterface/> : <AdminLoginPage/>}  
    </>
    );
}
export default AdminPage;