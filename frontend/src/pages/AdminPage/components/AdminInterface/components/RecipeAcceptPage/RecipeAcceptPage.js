import React, {useState, useEffect} from 'react';
import { Table} from './RecipeAcceptPage.css';

import { Link } from 'react-router-dom';
const RecipePage = () => {
    const [recipes, setRecipes] = useState([])

    const getRecipes = async() =>{
        const url = 'http://localhost:5432/get_recipes';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"status": "oczekujący"})
        });

        if (response.status===200) setRecipes(await response.json())

    }
    useEffect(() => {
        if(recipes.lenght !== 0){
            getRecipes();
        } 
      },[recipes.lenght]);

    const acceptRecipe = async(id) => {
        const url = `http://localhost:5432/accept_recipe?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'GET',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
        });

        if (response.status===200) getRecipes();
    }
    
    const renderRecipe = () =>{
        if(recipes.lenght!==0){
            return recipes.map((recipe) => {
              const { id_przepis, nazwa, data_dodania } = recipe 
              const date = new Date(data_dodania);
              return (
                <tr key={id_przepis}>
                    <td>{id_przepis}</td>
                    <td>{nazwa}</td>
                    <td>{(date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear())}</td>
                    <td><Link to={`/recipes/recipe?id=${id_przepis}`}>Show more</Link></td>
                    <td><button onClick={() => acceptRecipe(id_przepis)}>Accept</button></td>
                </tr>
              )
            })
          } 
    }


    return (
    <> 
    <div>Sortowanie</div> 
    <div>Przepisy</div>
        <Table>
            <thead>
                <tr>
                    <th>id </th> 
                    <th>nazwa </th>    
                    <th>data dodania </th>
                    <th>cały przepis </th>
                    <th>accept </th>
                </tr>
            </thead>
            <tbody>  
                {renderRecipe()}
            </tbody>
        </Table>
    </>
    );
}
export default RecipePage;