import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Form, Header, Button, CategoryChecker} from './RecipeForm.css';

const RecipeForm = () => {
    const productUnits = ["kg", "L", "g"]
    const { register, handleSubmit} = useForm();
    const [message, setMessage] = useState("")
    const [recipeCategories, setRecipeCategories] = useState([])
    const [availableProducts, setAvailableProducts] = useState([])
    const [productAdder, setProductAdder] = useState([])


    const getInfo = async(setter, category) => {
        const url = 'https://afternoon-hamlet-21659.herokuapp.com/user/get_info';
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

    const showProductAdder = () => {

        const tmpAdder = <div key={productAdder.length}>
            
            <label>Dodaj produkt</label> 
            <select ref={register} name={`products[${productAdder.length}].product`}>
                
            {availableProducts.map(product => {
                return <option 
                            key={product.id_produkt} 
                            value={product.nazwa}>
                            {product.nazwa}
                    </option>

            })}
            </select><br/>
            <label>Dodaj potrzebną ilość produktu</label> 
            <input ref={register} name={`products[${productAdder.length}].quantity`} type="number" />
            <label>Dodaj jednostkę produktu</label> 
            <select ref={register} name={`products[${productAdder.length}].unit`}>
            {productUnits.map(unit => {
                return <option key={unit} value={unit}>{unit}</option>
            })}
            </select><br/>

        </div>
        setProductAdder(productAdder => [...productAdder,tmpAdder ])
    }
    useEffect(() => {
        if(recipeCategories.lenght !== 0){
            getInfo(setRecipeCategories, "kategoria_przepis")

        } 
        if(availableProducts.lenght !== 0){
            getInfo(setAvailableProducts, "produkt")

        } 
      },[recipeCategories.lenght, availableProducts.lenght]);

    const addRecipe = async(data, e) => {
        data["token"] = localStorage.getItem('token')
        const url = 'https://afternoon-hamlet-21659.herokuapp.com/recipes/add_recipe';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const res = await response.json()
        setMessage(res.message);

        if (response.status === 200) {
            e.target.reset()   
            setMessage("Dodano przepis")
        }

    }
    return (
        <>
        <Form onSubmit={handleSubmit(addRecipe)} >
        <Header>Dodaj przepis</Header>
            <label>Nazwa</label>
            <input ref={register} name="name" type="text" required/>
            <label>Opis przygotowania</label><br/>
            <textarea rows="4" cols="50" ref={register} name="description" placeholder="Sposób przyrządzania dania" required/>
            {
            recipeCategories.map(
                (c) => {return <CategoryChecker key={c.id_kategoria_przepis}><label>{c.nazwa}</label><input  type="checkbox" name={`categories[${c.nazwa}]`} ref={register}/></CategoryChecker>}

            )
          }
            {productAdder}
            <Button type="button" onClick={showProductAdder} >Kolejny produkt?</Button> 
            <Button type="submit">Dodaj przepis</Button>      
            <p>{message}</p>
        </Form>

    </> 
        )
}
export default RecipeForm;