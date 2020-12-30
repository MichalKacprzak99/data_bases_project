import React, { useState } from 'react';
import { Layout, UserNickname, CreepyHello, OptionArea, Navbar} from './AdminInterface.css';
import {Adder, UsersController} from './components'
const AdminInterface = () => {
    const [adminActivity, setAdminActivity] = useState(null)
    const clickHandler = (e) => {

        const id = Number(e.target.id);
        if([ 2, 3, 4, 5].indexOf(id) >= 0){
            setAdminActivity(<Adder name={e.target.name}/>)
        }
        if(id === 7){
            setAdminActivity(<UsersController/>)
        }
    }
    return (
        <>
            <Layout>
                <UserNickname>Admin</UserNickname>
                <Navbar>  
                <button id='1' name="accept recipe" onClick={clickHandler}>Akceptuj Przepis</button>             
                <button id='2' name="product" onClick={clickHandler}>Dodaj produkt</button>
                <button id='3' name="product category" onClick={clickHandler}>Dodaj kategorie produktu</button>
                <button id='4' name="recipe category" onClick={clickHandler}>Dodaj kategorie przepisu</button>
                <button id='5' name="forum topic" onClick={clickHandler}>Dodaj temat na forum</button>
                <button id='6' name="user message" onClick={clickHandler}>Wiadomości od użytkowników</button>
                <button id='7' name="control users" onClick={clickHandler}>Zablokuj/Odblokuj uzytkowników</button>

                </Navbar>
                <CreepyHello>Witaj Drogi Adminie</CreepyHello>
                <OptionArea>
                   {adminActivity}
                </OptionArea>
            </Layout>
        </> 
        )
}
export default AdminInterface;