import React, { useState} from 'react';
import { useForm } from "react-hook-form";
import { Form, Header, Button} from './SendMessage.css';

const SendMessage = () => {

    const { register,reset, handleSubmit} = useForm();
    const [message, setMeesage] = useState("")

    const sendMessage = async(data) => {
        data["token"] = localStorage.getItem('token')
        const url = 'http://localhost:5432/user/sent_message';
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
            setMeesage(res.message);
            reset()   
        }
    }
    return (
        <>
        <Form onSubmit={handleSubmit(sendMessage)} >
        <Header>Send Message</Header>
            <textarea rows="4" cols="50" ref={register} name="message" placeholder="Please describe why"/>

            <Button type="submit">Send</Button>      
            <p>{message}</p>
        </Form>

    </> 
        )
}
export default SendMessage;