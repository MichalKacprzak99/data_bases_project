import React, {useState} from 'react';
import GlobalStyles from'./index.css.js';
import { Switch, Route, Link, BrowserRouter } from 'react-router-dom';
import {Header, Navbar, Footer, Center} from './Layout.css';
import { HomePage, LoginPage, RegisterPage, LogoutPage, UserPage, AdminPage, RecipePage, ForumPage} from './pages';



const App = () => {
  const initUseritem = localStorage.getItem('isLogged') || 'false';
  const [isLogged, setLogged] = useState(initUseritem)

  window.addEventListener('storage',  () => { 
    setLogged(localStorage.getItem('isLogged') );
  });


  return (
    <>
            <BrowserRouter>
      <GlobalStyles />

      <Header>Blog</Header>
      <Navbar>
            <Link to='/'>Strona główna</Link>
            {isLogged ==='true'? (<Link to='/logout'>Wylogowywanie</Link>) : (<Link to='/login'>Logowanie</Link>)}
            <Link to='/register'>Rejestracja</Link>
            {isLogged === 'true' ? (<Link to='/user'>Użytkownik</Link>) : null}
            <Link to='/recipes'>Przepisy</Link>
            <Link to='/admin'>Administracja</Link>
            <Link to='/forum'>Forum</Link>
      </Navbar>
      <Center>


      <Switch>
            <Route exact path='/' component={HomePage} />
            <Route  path='/forum' component={ForumPage} />
            <Route  path='/login' component={LoginPage} /> 
            <Route  path='/logout' component={LogoutPage} />           
            <Route  path='/register' component={RegisterPage} />
            <Route path='/user' component={UserPage} />
            <Route path='/admin'  component={AdminPage} />
            <Route path='/recipes' component={RecipePage} />
      </Switch>
              
      
      </Center>
      <Footer>Author: Michał Kacprzak</Footer>
      </BrowserRouter>
    </>
  );
}

export default App;
