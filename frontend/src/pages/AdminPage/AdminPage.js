import React from 'react';
import {AdminLoginPage, AdminInterface} from './components'
const AdminPage = () => {
  return (
    <>      
    {localStorage.getItem('isAdminLogged')==='true'? <AdminInterface/> : <AdminLoginPage/>}  
    </>
    );
}
export default AdminPage;