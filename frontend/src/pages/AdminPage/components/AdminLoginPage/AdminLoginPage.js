import React, {useState} from 'react';

import { useForm } from "react-hook-form";
import {Redirect} from "react-router-dom";
import { Form, Header, Button} from './AdminLoginPage.css';

const AdminLoginPage = () => {
  const [message, setMeesage] = useState("")
  const { register, handleSubmit} = useForm();
  const initAdminItem = localStorage.getItem('isAdminLogged') || 'false';

    const [isAdminLogin, setAdminLogin] = useState(initAdminItem)

    const handleLogin = async (data, e) => {
        const url = 'https://data-base-api.herokuapp.com/admin/loginAdmin';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const res = await response.json()

        if(response.status === 409) {
          setMeesage(res.message);
        } 
        else if (response.status === 200){
          e.target.reset()   
          localStorage.setItem('admin-token', res.token);
          localStorage.setItem('isAdminLogged', 'true');
          setAdminLogin(localStorage.getItem('isAdminLogged') )
        }
        else {
          setMeesage(res.message);
        }
    }
    return (
    <>
        <Form onSubmit={handleSubmit(handleLogin)} >
        <Header>Formularz Logowania Admina</Header>
            <label>Pseudonim</label>
            <input ref={register} name="nickname" type="text" />
            <label>Hasło</label>
            <input ref={register} name="password" type="password" />
            <Button type="submit">Zaloguj</Button>      
            <p>{message}</p>
        </Form>
        { isAdminLogin === 'true' ? <Redirect to="/admin" /> : null  }
    </> 
    )
}
export default AdminLoginPage;