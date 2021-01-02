import React, {useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Form, Header, Button} from './TrackedProducts.css';

const TrackedProducts = () => {
    const [availableProducts, setAvailableProducts] = useState([])
    const { register,reset, handleSubmit} = useForm();
    const [message, setMessage] = useState("")
    const [trackedProducts, setTrackedProducts] = useState([])
    const getInfo = async(setter, category) => {
        const url = 'http://localhost:5432/user/get_info';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"token": localStorage.getItem('token'), "category": category})
        });
        if(response.status !== 200) {
            setter(false)
        } else {

            setter(await response.json())
          }
    }

    const addTrackedProduct = async(data) => {
        data["token"] = localStorage.getItem('token')
        const url = 'http://localhost:5432/user/add_tracked_product';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        if(response.status === 200) {
            reset()
            setMessage("start")
            getTrackedProducts()
        } else {
            setMessage("juz sledzisz  ten produkt")
          }
    }

    const getTrackedProducts = async() => {
        const url = 'http://localhost:5432/user/get_tracked_products';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"token": localStorage.getItem('token')})
        });
        if(response.status === 200) {
            setTrackedProducts(await response.json())       
        } 
    }

    useEffect(() => {
        if(availableProducts.lenght !== 0){
            getInfo(setAvailableProducts, "produkt")
        } 
        if(trackedProducts.lenght !== 0){
            getTrackedProducts()
        }
      },[availableProducts.lenght, trackedProducts.lenght]);


    return (
        <>
       <div>Tracked Products</div> 
       <Form onSubmit={handleSubmit(addTrackedProduct)} >
       <Header>What product you wanna track?</Header><br/>
       {trackedProducts.map((trackedProduct)=>{
            const {nazwa, pasujacy_przepis, data_dopasowania, data_dodania} = trackedProduct
            console.log(nazwa, pasujacy_przepis, data_dopasowania, data_dodania)
            // const readable_data_dodania = new Date(data_dodania);
            // const readable_data_dopasowania = new Date(data_dopasowania);
            // console.log(readable_data_dopasowania)
       })}
       <label>Add product </label> 
        <select ref={register} name="product">
            {availableProducts.map(product => {
                return <option 
                            key={product.id_produkt} 
                            value={product.id_produkt}>
                            {product.nazwa}
                    </option>

            })}   

        </select><br/>
        <Button type="submit">Track</Button>  
           <p>{message}</p>
       </Form>
       </>
    )
}

export default TrackedProducts;