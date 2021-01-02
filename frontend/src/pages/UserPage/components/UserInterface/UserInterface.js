import React, { useState } from 'react';
import {Navbar} from './UserInterface.css';
import {RecipeForm, SendMessage} from './components'
import {RecipePage} from '../../../index'
const UserInterface = (props) => {
    const {userData} = props;
    const [userActivity, setUserActivity] = useState(null)
    const clickHandler = (e) => {

        const id = Number(e.target.id);
    }
    return (
        <>

 
                <Navbar>  
                <button id='1' name="add recipe" onClick={()=> { setUserActivity(<RecipeForm/>)}}>Dodaj przepis</button>             
                <button id='2' name="send message" onClick={()=> { setUserActivity(<SendMessage/>)}}>Wyślij wiadomość do administracji</button>
                <button id='3' name="liked recipes" onClick={() => {setUserActivity(<RecipePage onlyLiked={true}/>)}}>Polubione przepisy</button>
                <button id='4' name="tracked products" onClick={clickHandler}>Śledzone produkty</button>
                </Navbar>

                {userActivity}


        </> 
        )
}
export default UserInterface;