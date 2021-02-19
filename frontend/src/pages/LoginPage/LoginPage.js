import React, {useState} from 'react';

import { useForm } from "react-hook-form";
import {Redirect} from "react-router-dom";
import { Form, Header, Button} from './LoginPage.css';
const LoginPage = () => {
    const [message, setMeesage] = useState("")
    const { register, handleSubmit} = useForm();
    const [isLogin, setLogin] = useState(localStorage.getItem('isLogged'))

    const handleLogin = async (data, e) => {
        const url = 'https://data-base-api.herokuapp.com/user/login';
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
          localStorage.setItem('token', res.token);
          localStorage.setItem('isLogged', 'true');
          window.dispatchEvent( new Event('storage') );
          setLogin(localStorage.getItem('isLogged'))
        }
        else {
          setMeesage(res.message);
        }
    }
    return (
    <>
        <Form onSubmit={handleSubmit(handleLogin)} >
        <Header>Formularz logowania</Header>
            <label>Email</label>
            <input ref={register} name="email" type="email" required/>
            <label>Hasło</label>
            <input ref={register} name="password" type="text" required/>
            <Button type="submit">Zaloguj</Button>      
            <p>{message}</p>
        </Form>
        { isLogin==='true' ? <Redirect to="/" /> : null  }
    </> 
    )
}
export default LoginPage;