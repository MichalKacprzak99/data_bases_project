import React, {useState} from 'react';

import { useForm } from "react-hook-form";
import {Redirect} from "react-router-dom";
import { Form, Header, Button} from './LoginPage.css';
const LoginPage = ({setLogged, isLogged}) => {
    const [message, setMessage] = useState("")
    const { register, handleSubmit, reset} = useForm();


    const handleLogin = async (data, e) => {
        const url = 'http://localhost:5432/user/login';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const res = await response.json()

        if(response.status === 409) {
          setMessage(res.message);
        } 
        else if (response.status === 200){
          reset()
          localStorage.setItem('token', res.token);
          localStorage.setItem('isLogged', 'true');
          setLogged('true')
        }
        else {
          setMessage(res.message);
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
        { isLogged==='true' ? <Redirect to="/user" /> : null  }
    </> 
    )
}
export default LoginPage;