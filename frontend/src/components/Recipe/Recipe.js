import React, {useEffect, useState} from 'react';
import { useLocation,useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Popup from 'reactjs-popup';
// import 'reactjs-popup/dist/index.css';

const Recipe = () => {

    let history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const id = query.get('id')

    const { register, handleSubmit, register: register2, handleSubmit: handleSubmit2} = useForm();

    const [recipe, setRecipe] = useState(null)
    const [recipeProducts, setRecipeProducts] = useState([])
    const [recipeCategories, setRecipeCategories] = useState([])
    const [isLiked, setIsLiked] = useState(false)
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState(false)

    const getRecipe = async() =>{

        const url = `http://localhost:5432/get_recipe?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'POST',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"token": localStorage.getItem('token')})
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

        const url = `http://localhost:5432/get_recipe_products?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'GET',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
        });

        if (response.status===200) setRecipeProducts(await response.json())

    }

    const getRecipeCategories = async() =>{

        const url = `http://localhost:5432/get_recipe_categories?id_recipe=${id}`;
        const response = await fetch(url,{
            method: 'GET',
            credentials: 'omit',
            headers: {'Content-Type': 'application/json'},
        });

        if (response.status===200) setRecipeCategories(await response.json())

    }



    const likeRecipe = async(data) => {

        data["token"] = localStorage.getItem('token')
        const url = `http://localhost:5432/like_recipe?id_recipe=${id}`;
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
        const url = `http://localhost:5432/get_comments?id_recipe=${id}`;
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
        const url = `http://localhost:5432/add_comment?id_recipe=${id}`;
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
        const url = `http://localhost:5432/dislike_recipe?id_recipe=${id}`;
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
        return isLiked ? <button onClick={dislikeRecipe}>Dislike</button> : <Popup trigger={<button> Like</button>} >
            <form onSubmit={handleSubmit(likeRecipe)}>
            <textarea rows="4" cols="50" ref={register} name="description" placeholder="Why you like it"/><br/>
            <button type="submit">I like it</button> 
            </form> 
      </Popup>
    }
    const AddCommentPopUp = () => {
        return <Popup trigger={<button> Add Comment</button>} >
            <form onSubmit={handleSubmit2(addComment)}>
            <textarea rows="4" cols="50" ref={register2} name="description" placeholder="Please describe why"/><br/>
            <button type="submit">I like it</button> 
            </form>
        
      </Popup>
    }

    const getUserOptions = () => {
        if(localStorage.getItem('isLogged')==='true'){
            return <> {AddCommentPopUp()}{LikeRecipePopUp()}</>
        } 
    }

    useEffect(() => {
        if(recipe === null){
            getRecipe();
        } 
        if(recipeProducts.lenght !== 0){
            getRecipeProducts();
        } 
        if(recipeCategories.lenght !== 0){
            getRecipeCategories();
        } 
        if(comments.lenght !== 0){
            getComments();
        } 
      },[]);

    const renderComments = () =>{
        return comments.map((comment) => {
            const {id_komentarz, pseudonim, tresc} = comment;
            return <div key={id_komentarz}>{tresc}, {pseudonim}</div>
        })
    }

    return (
    <>
        {recipe && Object.keys(recipe).map((key) => {
        const value = recipe[key];
        return <div>{key}:{value.toString()}</div>
        })}
        {recipeCategories.map((category) => {
            return <div>Kategoria:{category.nazwa}</div>
        })}
        <div >Skład</div>
        {recipeProducts.map((product) => {
            const {ilosc, jednostka, nazwa } = product;
            return <div>{nazwa}:{ilosc+jednostka}</div>
        })}
        <button onClick={()=>setShowComments(showComments => !showComments)}>Show comments</button>
        {showComments ? renderComments() : null}
        {getUserOptions()} 
    </> 
    )
}
export default Recipe;