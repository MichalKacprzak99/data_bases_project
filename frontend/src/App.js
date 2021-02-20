import React, {useState} from 'react';
import GlobalStyles from'./index.css.js';
import { Switch, Route, Link, BrowserRouter } from 'react-router-dom';
import {Header, Navbar, Footer, Center, Content} from './Layout.css';
import { HomePage, LoginPage, RegisterPage, UserPage, AdminPage, RecipePage, ForumPage} from './pages';



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

        <Content> 
        <Header>INFORMATYK GOTUJE</Header>
        <Navbar>
            <Link to='/'>Strona główna</Link>
            {isLogged ==='true'? null : (<Link to='/login'>Logowanie</Link>)}
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
            <Route  path='/login' render={()=> {return <LoginPage setLogged={setLogged} isLogged={isLogged}/>} }/>
            <Route  path='/register' component={RegisterPage} />
            <Route path='/user' component={UserPage} />
            <Route path='/admin'  component={AdminPage} />
            <Route path='/recipes' component={RecipePage} />
        </Switch>
              
      
        </Center>
        </Content>
        <Footer>Author: Michał Kacprzak</Footer>
        </BrowserRouter>
    </>
  );
}

export default App;
