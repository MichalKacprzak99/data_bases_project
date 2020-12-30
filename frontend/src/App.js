import GlobalStyles from'./index.css.js';
import { Switch, Route, Link } from 'react-router-dom';
import { Header, Navbar, Footer, Center} from './Layout.css';
import { HomePage, LoginPage, RegisterPage, LogoutPage, UserPage, AdminPage } from './pages';
import React, {useState} from 'react';



const App = () => {
  const initUseritem = localStorage.getItem('isLogged') || 'false';
  const [isLogged, setLogged] = useState(initUseritem)

  window.addEventListener('storage',  () => { 
    setLogged(localStorage.getItem('isLogged') );
  });


  return (
    <>
      <GlobalStyles />
      <Header>Blog</Header>
      <Navbar>
            <Link to='/'>Strona główna</Link>
            {isLogged !=='true'? (<Link to='/login'>Logowanie</Link>) : (<Link to='/logout'>Wylogowywanie</Link>)}
            
            <Link to='/register'>Rejestracja</Link>
            <Link to='/user'>Użytkownik</Link>
            <Link to='/recipes'>Przepisy</Link>
            <Link to='/admin'>Administracja</Link>
            <Link to='/forum'>Forum</Link>
      </Navbar>
      <Center>
      <Switch>
            <Route path='/' exact component={HomePage} />
            <Route path='/login' exact component={LoginPage} /> 
            <Route path='/logout' exact component={LogoutPage} />           
            <Route path='/register' exact component={RegisterPage} />
            <Route path='/user' exact component={UserPage} />
            <Route path='/admin' exact component={AdminPage} />
      </Switch>
      </Center>

      <Footer>Author: Michał Kacprzak</Footer>
    </>
  );
}

export default App;
