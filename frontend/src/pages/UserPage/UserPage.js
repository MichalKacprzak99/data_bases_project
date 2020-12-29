import React, {useState, useEffect} from 'react';
import {UserInterface} from './components'
// import {NotLoggedView} from '../../components'
import {Redirect} from "react-router-dom";
const UserPage = () => {
  const [userData, setUserData] = useState(null)

  const getUserInfo = async() => {
    const url = 'http://localhost:5432/user';
    const response = await fetch(url,{
        method: 'POST',
        credentials: 'omit',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"token": localStorage.getItem('token')})
    });
    if(response.status !== 200) {
      return false;
    } else {
      return await response.json();  
    }
  }
  useEffect(() => {
    if(!userData){
      getUserInfo()
      .then(result => {
        setUserData(result);
      })
      .catch(e => {
        console.log(e);
      });
    } 
  },[]);

  return (
    <>
    {localStorage.getItem('isLogged')==='true'? <UserInterface/> : <Redirect to="/login" />} 
    <div>{userData?.imie}</div>
 
    </>
    );
}
export default UserPage;