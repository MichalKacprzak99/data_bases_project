import React, {useState, useEffect} from 'react';
import { Table} from './RecipePage.css';

import { Link } from 'react-router-dom';
const RecipePage = (props) => {
    const [recipes, setRecipes] = useState([])
    const onlyLiked = props.onlyLiked || false;
    const getRecipes = async() =>{
        const url = 'http://localhost:5432/get_recipes';
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"status": "zaakceptowany", "token": localStorage.getItem('token')})
        });

        if (response.status===200) setRecipes(await response.json())

    }
    useEffect(() => {
        if(recipes.lenght !== 0){
            getRecipes();
        } 
      },[recipes.lenght]);

    
    const renderRecipe = () =>{
        if(recipes.lenght!==0){
            return recipes.map((recipe) => {
              const { id_przepis, nazwa, data_dodania, polubiony } = recipe 
              const date = new Date(data_dodania);
              if(!onlyLiked || polubiony ){
                return (
                    <tr key={id_przepis}>
                        <td>{id_przepis}</td>
                        <td>{nazwa}</td>
                        <td>{(date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear())}</td>
                        <td><Link to={`/recipes/recipe?id=${id_przepis}`}>Show more</Link></td>
                    </tr>
                  );
              } else {
                  return null;
              }
              
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