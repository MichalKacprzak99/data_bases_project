import React, {useEffect, useState} from 'react';
import { useLocation,useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Popup from 'reactjs-popup';

import {Button, ButtonGroup} from './Recipe.css'
const Recipe = () => {

    let history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = query.get('id')
    const status = query.get('status')

    const { register, handleSubmit, register: register2, handleSubmit: handleSubmit2} = useForm();

    const [recipe, setRecipe] = useState(null)
    const [recipeProducts, setRecipeProducts] = useState([])
    const [recipeCategories, setRecipeCategories] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)

    const getRecipe = async() =>{
        console.log("ala")
        const url = `http://localhost:5432/recipes/get_recipe?id_recipe=${id}&status=${status}`;
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"token": localStorage.getItem('token'),"adminToken": localStorage.getItem('admin-token')})
        });
        
        if (response.status===200) {
            const res = await response.json();

            if(res === null){
                history.push('/recipes')
            } else {
                setRecipe(res)
                setIsLiked(res.polubiony)
            }
 
        }

    }

    const getRecipeProducts = async() =>{

        const url = `http://localhost:5432/recipes/get_recipe_products?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'GET',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
        });

        if (response.status===200) setRecipeProducts(await response.json())

    }

    const getRecipeCategories = async() =>{

        const url = `http://localhost:5432/recipes/get_recipe_categories?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'GET',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
        });

        if (response.status===200) setRecipeCategories(await response.json())

    }



    const likeRecipe = async(data) => {

        data["token"] = localStorage.getItem('token')
        const url = `http://localhost:5432/recipes/like_recipe?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (response.status === 200){
            setIsLiked(true);
        }

    }

    const getComments = async() => {
        const url = `http://localhost:5432/recipes/get_comments?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'GET',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
        });

        if (response.status === 200){
            setComments(await response.json());
        }

    }

    const addComment = async(data) => {

        data["token"] = localStorage.getItem('token')
        const url = `http://localhost:5432/recipes/add_comment?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (response.status === 200){
            getComments();
        }

    }


    const dislikeRecipe = async() => {
        const url = `http://localhost:5432/recipes/dislike_recipe?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"token":localStorage.getItem('token')})
        });

        if (response.status === 200){
            setIsLiked(false);
        }
        
    }

    const LikeRecipePopUp = () => {
        return isLiked ? <Button onClick={dislikeRecipe}>Znielub</Button> : <Popup trigger={<Button> Polub</Button>} >
            <form onSubmit={handleSubmit(likeRecipe)}>
            <textarea rows="4" cols="50" ref={register} name="description" placeholder="Co cię zainteresowało?"/><br/>
            <Button type="submit">Lubie to</Button> 
            </form> 
      </Popup>
    }
    const AddCommentPopUp = () => {
        return <Popup trigger={<Button> Dodaj komentarz</Button>} >
            <form onSubmit={handleSubmit2(addComment)}>
            <textarea rows="4" cols="50" ref={register2} name="description" placeholder="Treść"/><br/>
            <Button type="submit">Skomentuj</Button> 
            </form>
        
      </Popup>
    }

    const getUserOptions = () => {
        if(localStorage.getItem('isLogged')==='true'){
            return <> {AddCommentPopUp()}{LikeRecipePopUp()}</>
        } 
    }

    useEffect(() => {
        getRecipe();
        getRecipeProducts();
        getRecipeCategories();
        getComments();

      },[]);

    const renderComments = () =>{
        return comments.map((comment) => {
            const {id_komentarz, pseudonim, tresc} = comment;
            return <div key={id_komentarz}>Tresc:{tresc}, Autor:{pseudonim}</div>
        })
    }

    const RenderRecipe = () => {
        const {nazwa, opis} = recipe
        return <>
            <div>Nazwa {nazwa}</div>
            <div>Opis {opis}</div>
            
            {recipeCategories.map((category) => {
                return <div key={category.nazwa}>Kategoria:{category.nazwa}</div>
            })}
            <div >Skład</div>
            {recipeProducts.map((product) => {
                const {ilosc, jednostka, nazwa } = product;
                return <div key={nazwa}>{nazwa}:{ilosc+jednostka}</div>
            })}</>
    }

    return (
    <>
        
        {recipe!=null?<RenderRecipe/>: null }
        {showComments ? renderComments() : null}
        <ButtonGroup>
        <Button onClick={()=>setShowComments(showComments => !showComments)}>Pokaż komentarze</Button>
        {getUserOptions()} 
        </ButtonGroup>


        
    </> 
    )
}
export default Recipe;