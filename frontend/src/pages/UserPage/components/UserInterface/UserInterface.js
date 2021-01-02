import React, { useState } from 'react';
import {Navbar} from './UserInterface.css';
import {RecipeForm, SendMessage, TrackedProducts} from './components'
import {RecipePage} from '../../../index'
const UserInterface = (props) => {
    const {userData} = props;
    const [userActivity, setUserActivity] = useState(null)
// add user profile
    return (
        <>

 
                <Navbar>  
                <button name="add recipe" onClick={()=> { setUserActivity(<RecipeForm/>)}}>Dodaj przepis</button>             
                <button name="send message" onClick={()=> { setUserActivity(<SendMessage/>)}}>Wyślij wiadomość do administracji</button>
                <button name="liked recipes" onClick={() => {setUserActivity(<RecipePage onlyLiked={true}/>)}}>Polubione przepisy</button>
                <button name="tracked products" onClick={() => {setUserActivity(<TrackedProducts/>)}}>Śledzone produkty</button>
                </Navbar>

                {userActivity}


        </> 
        )
}
export default UserInterface;