import React, {useState, useEffect} from 'react';
import {Redirect} from "react-router-dom";
const AdminPage = () => {

  return (
    <>
    {localStorage.getItem('isAdminLogged')==='true'? <div>Admin Page</div> : <Redirect to="/loginAdmin" />}  
    </>
    );
}
export default AdminPage;