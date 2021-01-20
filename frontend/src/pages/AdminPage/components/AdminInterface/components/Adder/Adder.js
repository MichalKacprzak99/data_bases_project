import React, { useState, useEffect} from 'react';
import { Form, Header, Button} from './Adder.css';
import { useForm } from "react-hook-form";

const Adder = (props) => {
    const { register,reset, handleSubmit} = useForm();
    const [message, setMeesage] = useState("")
    const [productCategories, setProductCategories] = useState([])
    const [toAdd, setToAdd] = useState(props.name);


    
    const handleAdding = async (data, e) => {
        data["token"] = localStorage.getItem('admin-token')
        const url = `http://localhost:5432/admin/add_${toAdd.replace(/\s/g, '_')}`;
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
    
  const getProductCategories = async() => {

    const url = `http://localhost:5432/admin/get_product_categories`;
    const response = await fetch(url,{
        method: 'POST',
        credentials: 'omit',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"token": localStorage.getItem('admin-token')})
    });
    const res = await response.json()

    if(response.status === 200) {
      setProductCategories(res);
    } 

  }

  useEffect(() => {
    setToAdd(props.name);
    setMeesage("")
    reset()
    if(productCategories.lenght !== 0){
      getProductCategories();
  } 
  }, [props.name, reset, productCategories.lenght])

    return (
        
        <Form onSubmit={handleSubmit(handleAdding)} >
            <Header>Add {toAdd}</Header>
            <input ref={register} name={toAdd.replace(/\s/g, '_')} type="text" />
            {toAdd==="forum topic"? <input ref={register} name="description" type="text" /> : null}

            {toAdd==="product"? <><select ref={register} name="product_category">
                
                {productCategories.map(productCategory => {
                    return <option 
                                key={productCategory.id_kategoria_produkt} 
                                value={productCategory.id_kategoria_produkt}>
                                {productCategory.nazwa}
                        </option>
    
                })}
                </select><br/></>: null}
            <Button type="submit">Add</Button>   

            <p>{message}</p> 
        </Form>

        )
}
export default Adder;