import React, {useState} from 'react';
import { useForm } from "react-hook-form";
import {Redirect, useHistory} from "react-router-dom";
import { Form, Header, Button, ButtonGroup} from './RegisterPage.css';

const RegisterPage = () => {

  const { register, handleSubmit} = useForm();
  const [isRegister, setRegister] = useState(false)
  const [message, setMeesage] = useState("")
  const { push } = useHistory()

  const handleRegister = async (data, e) => {
      const url = 'http://localhost:5432/user/register';
      const response = await fetch(url,{
          method: 'POST',
          credentials: 'omit',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
      });
      const res = await response.json()
      setMeesage(res.message);
      if(response.status === 200) {
        setRegister(true)
      }
      
      
  }
  
  return (
      <Form id="form" onSubmit={handleSubmit(handleRegister)}>
          <Header>Formularz rejestracji</Header>
          <label >Imie </label>
          <input ref={register} name="name" type="text" required/>
          <label>Nazwisko</label>
          <input ref={register} name="surname" type="text" required/>
          <label>Email</label>
          <input ref={register} name="email"  type="text" required/>
          <label>Pseudonim</label>
          <input ref={register} name="user_name" type="text" required/>
          <label>Hasło </label>
          <input ref={register} name="password" type="password" required/>
      <ButtonGroup>
        <Button type="button" onClick={() => push('/')}>Wróc do menu</Button>
        <Button type="submit" >Zarejestruj się</Button>
      </ButtonGroup>
      <p>{message}</p>
      { isRegister ? <Redirect to="/login" /> : null  }
  </Form>

  )
}
export default RegisterPage;