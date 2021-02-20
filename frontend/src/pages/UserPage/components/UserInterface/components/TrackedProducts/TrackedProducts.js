import React, {useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Form, Header, Button, Table} from './TrackedProducts.css';
import {Link} from 'react-router-dom';
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
      getInfo(setAvailableProducts, "produkt")
      getTrackedProducts()
    },[]);


    const RenderTrackedProductsTable = () => {
        return <> 
            <Table>
                <thead>
                    <tr>
                        <th>nazwa </th>    
                        <th>data dodania </th>
                        <th>data dopasowania </th>
                        <th>Dopasowany przepis </th>
                    </tr>
                </thead>
                <tbody>  
                    {renderTrackedProduct()}
                </tbody>
            </Table> </>
     }

    const renderTrackedProduct = () =>{
        if(trackedProducts.lenght!==0){
            return trackedProducts.map((trackedProduct) => {
              const {pasujacy_przepis, nazwa, data_dodania, data_dopasowania } = trackedProduct
              const addedDate = new Date(data_dodania);
              let matchedDateRepr
              let linkToRecipe
              if (data_dopasowania){
                const matchedDate = new Date(data_dopasowania);
                matchedDateRepr = matchedDate.getDate() + '/' + ( matchedDate.getMonth() + 1) + '/' +   matchedDate.getFullYear()
                linkToRecipe = <Link to={`/recipes/recipe?id=${pasujacy_przepis}`}>Pokaż więcej</Link>
            } else{
                matchedDateRepr = linkToRecipe= "Brak pasującego przepisu"
              }
              

                return (
                    <tr key={nazwa}>
                        <td>{nazwa}</td>
                        <td>{( addedDate.getDate() + '/' + ( addedDate.getMonth() + 1) + '/' +   addedDate.getFullYear())}</td>
                        <td>{matchedDateRepr}</td>
                        <td>{linkToRecipe}</td>
                    </tr>
                  ); 
            })
          } 
    }
    
    return (
        <>
        {RenderTrackedProductsTable()}
       <Form onSubmit={handleSubmit(addTrackedProduct)} >
       <Header>Jaki produkt chcesz śledzić?</Header><br/>
    
       <label>Wybierz produkt </label> 
        <select ref={register} name="product">
            {availableProducts.map(product => {
                return <option 
                            key={product.id_produkt} 
                            value={product.id_produkt}>
                            {product.nazwa}
                    </option>

            })}   

        </select><br/>
        <Button type="submit">Śledz</Button>  
           <p>{message}</p>
       </Form>
       </>
    )
}

export default TrackedProducts;