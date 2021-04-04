import React, {useState} from 'react';
import './App.css';
import {Movies} from './components/movies/Movies.js';
import {Register} from './components/register/Register.js';
import {Login} from './components/login/Login.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function App() {

    const saveToken = (data) => window.localStorage.setItem('token', data.token);

    const isLoggedIn = () => window.localStorage.getItem('token') != undefined;

    const successRegister = "You're now in our user database, navigate to the login page on the navigation menu and log in with your login and password!";

    return (
        <div className="App">
          <Router>
            <div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  {!isLoggedIn &&
                   (<li>
                      <Link to="/register">Register</Link>
                    </li>)}
                  {!isLoggedIn &&
                   (<li>
                      <Link to="/login">Login</Link>
                    </li>)}
                </ul>
              </nav>

              <Switch>
                <Route path="/register">
                  <Register onSuccess={(data) => alert(successRegister)}/>
                </Route>
                <Route path="/login">
                  <Login onSuccess={saveToken}/>
                </Route>
                <Route path="/">
                  <div class="welcome-home">

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
