import React, { useState } from 'react';
import {Navbar} from './UserInterface.css';
import {RecipeForm, SendMessage, TrackedProducts, UserProfile} from './components'
import {RecipePage} from '../../../index'

const UserInterface = ({userData}) => {

    const [userActivity, setUserActivity] = useState(null)

    const handleLogout = () => {
      
      localStorage.setItem('isLogged', 'false');
      localStorage.setItem('token', 'null');
      window.dispatchEvent( new Event('storage') );


    }
// add user profile
    return (
        <>

 
                <Navbar>  
                <button name="add recipe" onClick={()=> { setUserActivity(<UserProfile userData={userData}/>)}}>Profil</button> 
                <button name="add recipe" onClick={()=> { setUserActivity(<RecipeForm/>)}}>Dodaj przepis</button>             
                <button name="send message" onClick={()=> { setUserActivity(<SendMessage/>)}}>Wyślij wiadomość do administracji</button>
                <button name="liked recipes" onClick={() => {setUserActivity(<RecipePage onlyLiked={true}/>)}}>Polubione przepisy</button>
                <button name="tracked products" onClick={() => {setUserActivity(<TrackedProducts/>)}}>Śledzone produkty</button>
                <button name="logout" onClick={handleLogout} >Wyloguj</button>
                </Navbar>

                {userActivity}


        </> 
        )
}
export default UserInterface;