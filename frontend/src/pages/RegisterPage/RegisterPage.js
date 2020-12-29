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
      const url = 'http://localhost:5432/register';
      const response = await fetch(url,{
          method: 'POST',
          credentials: 'omit',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
      });
      if(response.status === 409) {
        setMeesage(response.status);
      } else {
        e.target.reset()   
        setRegister(true)    
      }
      
      
  }
  
  return (
      <Form id="form" onSubmit={handleSubmit(handleRegister)}>
          <Header>Registration Form</Header>
          <label >Imie </label>
          <input ref={register} name="name" type="text" />
          <label>Nazwisko</label>
          <input ref={register} name="surname" type="text" />
          <label>Email</label>
          <input ref={register} name="email"  type="text" />
          <label>Nickname</label>
          <input ref={register} name="user_name" type="text" />
          <label>Password </label>
          <input ref={register} name="password" type="password" />
      <ButtonGroup>
        <Button type="button" onClick={() => push('/')}>To main</Button>
        <Button type="submit" >register now</Button>
      </ButtonGroup>
      <p>{message}</p>
      { isRegister ? <Redirect to="/login" /> : null  }
  </Form>

  )
}
export default RegisterPage;