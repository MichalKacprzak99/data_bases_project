import React, {useState, useEffect} from 'react';
import { Table, Form, Header, Button} from './RecipePage.css';
import {Recipe} from '../../components'
import { Switch, Route, Link} from 'react-router-dom';
import { useForm } from "react-hook-form";
const RecipePage = (props) => {
    const [recipes, setRecipes] = useState([])
    const [productCategories, setProductCategories] = useState([])
    const [recipeCategories, setRecipeCategories] = useState([])
    const { register, handleSubmit} = useForm();

    const onlyLiked = props.onlyLiked || false;
    const getRecipes = async() =>{
        const url = 'https://afternoon-hamlet-21659.herokuapp.com/recipes/get_recipes';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"status": "zaakceptowany", "token": localStorage.getItem('token'), "onlyLiked":onlyLiked})
        });

        if (response.status===200) setRecipes(await response.json())

    }

    const getProductCategories = async() => {

        const url = `https://afternoon-hamlet-21659.herokuapp.com/admin/get_product_categories`;
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

      const getRecipeCategories = async() => {

        const url = `https://afternoon-hamlet-21659.herokuapp.com/admin/get_recipe_categories`;
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"token": localStorage.getItem('admin-token')})
        });
        const res = await response.json()
    
        if(response.status === 200) {
            setRecipeCategories(res);
        } 
    
      }
    

    useEffect(() => {
        if(recipes.lenght !== 0){
            getRecipes();
        }
        if(productCategories.lenght !== 0){
            getProductCategories();
        }
        if(recipeCategories.lenght !== 0){
            getRecipeCategories();
        }
      },[]);

    
    const renderRecipe = () =>{
        if(recipes.lenght!==0){
            return recipes.map((recipe) => {
              const { id_przepis, nazwa, data_dodania, notatka} = recipe 
              const date = new Date(data_dodania);
                return (
                    <tr key={id_przepis}>
                        <td>{id_przepis}</td>
                        <td>{nazwa}</td>
                        <td>{(date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear())}</td>

                        <td><Link to={`/recipes/recipe?id=${id_przepis}&status=zaakceptowany`}>Show more</Link></td>
                        {onlyLiked ? <td><textarea readOnly rows = "5" cols = "60" name = "description" value={notatka}></textarea></td>: null}
                        
        
                    </tr>
                  );
              
            })
          } 
    }

    const RenderRecipesTable = () => {
       return <> 
  
            <Table>
                <thead>
                    <tr>
                        <th>id </th> 
                        <th>nazwa </th>    
                        <th>data dodania </th>
                        <th>cały przepis </th>
                        {onlyLiked ? <th>notatka</th>: null}
                    </tr>
                </thead>
                <tbody>  
                    {renderRecipe()}
                </tbody>
            </Table> </>
    }

    const searchRecipes = async(data) => {

        const url = 'https://afternoon-hamlet-21659.herokuapp.com/recipes/filter_recipes';
        data["status"]= "zaakceptowany"
        data["onlyLiked"]=onlyLiked
        data["token"] = localStorage.getItem('token')
        let wantedRecipeCategories = ``
        for(const category in data.categories){
            if(Object.keys(data.categories[category]).length !==0 || data.categories[category] === true){
                wantedRecipeCategories += `'${category}',`
            }              
        }
        data.categories =  wantedRecipeCategories ? wantedRecipeCategories.replace(/,$/, '') : "kategoria_przepis.nazwa";

        let wantedProductCategories = ""
        for(const product in data.productCategories){
            if(Object.keys(data.productCategories[product]).length !==0 || data.productCategories[product] === true){
                wantedProductCategories += `'${product}',`
            }              
        }
        data.productCategories =  wantedProductCategories ? wantedProductCategories.replace(/,$/, '') : "kategoria_produkt.nazwa";

        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        
        if(response.status === 200) {
            const res = await response.json()
            setRecipes(res);
        } 



    }

    const RenderSearchRecipeForm = () => {
        return <Form onSubmit={handleSubmit(searchRecipes)}>
                      <Header>Jakich przepisów szukasz?</Header>
          <label >Sortuj według daty dodania </label>
          <select ref={register} name="added_date" type="date" >
              <option value="ASC">rosnąco</option>
              <option value="DESC">malejąco</option>
          </select><br/>
          <label >Minimalna liczba produktów </label>
          <input type="number" ref={register} name="minimumProductNumber" min="1" defaultValue="1"></input><br/>
          <label >Sortuj po nazwie </label>
          <select ref={register} name="name" type="date" >
              <option value="ASC">rosnąco</option>
              <option value="DESC">malejąco</option>
          </select><br/>
          <label >Sortuj po kategorii przepisu </label>

                       { recipeCategories.map(
                (c) => {return <div key={c.id_kategoria_przepis}><label>{c.nazwa}</label><input  type="checkbox" name={`categories[${c.nazwa}]`} ref={register}/></div>}

            )}
            <label >Sortuj po kategorii produktu który chcesz znaleść w przepisie </label>
            { productCategories.map(
                (c) => {return <div key={c.id_kategoria_produkt}><label>{c.nazwa}</label><input  type="checkbox" name={`productCategories[${c.nazwa}]`} ref={register} /></div>}

            )}
            <Button type="submit">Search Recipes</Button>  
        </Form>
    }
    return (
    <> 
        
        <Switch>
            <Route exact path={["/recipes", "/user", "/admin"]}>
            <>
            <RenderSearchRecipeForm/>
            <RenderRecipesTable />
            </>
          </Route>
            <Route exact path="/recipes/recipe" component={Recipe}/>
            {/* <Route exact path="/admin/recipe" component={Recipe}/> */}
            </Switch>
    </>
    );
}
export default RecipePage;