import React, {useState, useEffect} from 'react';
import {UserInterface} from './components'
import {Redirect} from "react-router-dom";
const UserPage = () => {
  const [userData, setUserData] = useState(false)

  const getUserInfo = async() => {
    const url = 'http://localhost:5432/user';
    const response = await fetch(url,{
        method: 'POST',
        credentials: 'omit',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"token": localStorage.getItem('token')})
    });
    if(response.status !== 200) {
      return setUserData(false);
    } else {
      return setUserData(await response.json());  
    }
  }
  useEffect(() => {
    if(!userData){
      getUserInfo();
    } 
  },[]);

  return (
    <>
    {localStorage.getItem('isLogged')==='true'? <UserInterface userData={userData}/> : <Redirect to="/login" />} 
    </>
    );
}
export default UserPage;