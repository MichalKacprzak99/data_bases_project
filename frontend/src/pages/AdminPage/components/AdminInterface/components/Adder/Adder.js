import React, { useState, useEffect} from 'react';
import { Form, Header, Button} from './Adder.css';
import { useForm } from "react-hook-form";

const Adder = (props) => {
    const { register,reset, handleSubmit} = useForm();
    const [message, setMeesage] = useState("")
    const [toAdd, setToAdd] = React.useState(props.name);

    useEffect(() => {
        setToAdd(props.name);
        setMeesage("")
        reset()
    }, [props.name, reset])
    
    const handleAdding = async (data, e) => {
        data["token"] = localStorage.getItem('admin-token')
        const url = `http://localhost:5432/add_${toAdd.replace(/\s/g, '_')}`;
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
          setMeesage(res.message);
        }
        else {
          setMeesage(res.message);
        }
    }
    return (

        <Form onSubmit={handleSubmit(handleAdding)} >
            <Header>Add {toAdd}</Header>
            <input ref={register} name={toAdd.replace(/\s/g, '_')} type="text" />
            {toAdd==="forum topic"? <input ref={register} name="description" type="text" /> : null}
            <Button type="submit">Add</Button>   

            <p>{message}</p> 
        </Form>

        )
}
export default Adder;