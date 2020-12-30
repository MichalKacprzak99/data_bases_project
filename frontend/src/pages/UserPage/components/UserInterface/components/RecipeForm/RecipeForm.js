import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Form, Header, Button} from './RecipeForm.css';

const RecipeForm = () => {
    const productUnits = ["kg", "L", "g"]
    const { register, handleSubmit} = useForm();
    const [message, setMeesage] = useState("")
    const [productCategories, setProductCategories] = useState([])
    const [recipeCategories, setRecipeCategories] = useState([])
    const [availableProducts, setAvailableProducts] = useState([])
    // const [recipeCategories, setRecipeCategories] = useState([])
    const [productAdder, setProductAdder] = useState([])


    const getInfo = async(setter, category) => {
        const url = 'http://localhost:5432/get_info';
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
            
            <label>Add product</label> 
            <select ref={register} name={`products[${productAdder.length}].name`}>
            {availableProducts.map(product => {
                return <option key={product.id_produkt} value={product.nazwa}>{product.nazwa}</option>
            })}
            </select><br/>
            <label>Add product quantity</label> 
            <input ref={register} name={`products[${productAdder.length}].quantity`} type="number" />
            <label>Add product unit</label> 
            <select ref={register} name={`products[${productAdder.length}].unit`}>
            {productUnits.map(unit => {
                return <option key={unit} value={unit}>{unit}</option>
            })}
            </select><br/>
            <label>Add product category</label>
            <select ref={register} name={`products[${productAdder.length}].category`}>
            {productCategories.map(category=> {
                return <option key={category.id_kategoria_produkt} value={category.nazwa}>{category.nazwa}</option>
            })}
            </select><br/>
        </div>
        setProductAdder(productAdder => [...productAdder,tmpAdder ])
    }
    useEffect(() => {
        if(productCategories.lenght !== 0){
            getInfo(setProductCategories, "kategoria_produkt")
        } 
        if(recipeCategories.lenght !== 0){
            getInfo(setRecipeCategories, "kategoria_przepis")

        } 
        if(availableProducts.lenght !== 0){
            getInfo(setAvailableProducts, "produkt")

        } 
      },[]);

    const addRecipe = async(data) => {
        data["token"] = localStorage.getItem('token')
        // console.log(data)
        const url = 'http://localhost:5432/add_recipe';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        // const res = await response.json()

        // if(response.status === 409) {
        //   setMeesage(res.message);
        // } 
        // else if (response.status === 200){
        //   e.target.reset()   
        //   localStorage.setItem('token', res.token);
        //   localStorage.setItem('isLogged', 'true');
        //   window.dispatchEvent( new Event('storage') );
        // //   setLogin(localStorage.getItem('isLogged'))
        // }
        // else {
        //   setMeesage(res.message);
        // }
    }
    return (
        <>
        <Form onSubmit={handleSubmit(addRecipe)} >
        <Header>Add Recipe</Header>
            <label>Name</label>
            <input ref={register} name="name" type="text" />
            <label>Description</label><br/>
            <textarea rows="4" cols="50" ref={register} name="description" placeholder="Please describe why"/>
            {
            recipeCategories.map(
                (c) => {return <div key={c.id_kategoria_przepis}><label>{c.nazwa}</label><input  type="checkbox" name={`categories[${c.nazwa}]`} ref={register} /></div>}

            )
          }
            {productAdder}
            <Button type="button" onClick={showProductAdder} >You wanna add product?</Button> 
            <Button type="submit">Add recipe</Button>      
            <p>{message}</p>
        </Form>

    </> 
        )
}
export default RecipeForm;