import React, {useState} from 'react';
import './App.css';
import {Movies} from './components/movies/Movies.js';
import {Register} from './components/register/Register.js';
import {Login} from './components/login/Login.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    useHistory
} from "react-router-dom";

function NavLi({title, path, action}) {

    const history = useHistory();

    return (<li className={useLocation().pathname === path ? 'nav-active' : ''}>
              {!!action ? (<button onClick={() => action(history)}>{title}</button>) : (<Link to={path}>{title}</Link>)}
            </li>);
}

function App() {

    const [token, setToken] = useState(window.localStorage.getItem('token'));

    const saveToken = (data, history) => {
        window.localStorage.setItem('token', data.token);
        setToken(window.localStorage.getItem('token'));
        history.push('/');
    };

    const isLoggedIn = () => !!token;

    const clearToken = (history) => {
        window.localStorage.removeItem('token');
        setToken(null);
        history.push('/login');
    };

    return (
        <div className="App">
          <Router>
            <div>
              <nav>
                <ul>
                  <NavLi title="Home" path="/" />
                  {!isLoggedIn() &&
                   <NavLi title="Register" path="/register" />}
                  {!isLoggedIn() &&
                   <NavLi title="Log in" path="/login" />}
                  {isLoggedIn() &&
                   <NavLi title="Log out" path="/login" action={clearToken} />}
                </ul>
              </nav>

              <Switch>
                <Route path="/register">
                  <Register onSuccess={(history) => history.push('/login')}/>
                </Route>
                <Route path="/login">
                  <Login onSuccess={saveToken}/>
                </Route>
                <Route path="/">
                  <div className="welcome-home">

                    <p>

                      Hello! You are here to vote for the best movie
                      of the week.  Indeed, every week, users are given
                      3 votes to choose 0 to 3 of their favorite movies!

                    </p>

                    <p>

                      If you're not yet registered, do it now by
                      clicking <Link to="/register">here</Link>!

                    </p>

                  </div>
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
    );
}

export default App;
