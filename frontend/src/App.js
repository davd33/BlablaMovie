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

    return (
        <div className="App">
          <Router>
            <div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                </ul>
              </nav>

              <Switch>
                <Route path="/register">
                  <Register onSuccess={(data) => console.log("registered!")}/>
                </Route>
                <Route path="/login">
                  <Login onSuccess={saveToken}/>
                </Route>
                <Route path="/">
                  Hello world
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
    );
}

export default App;
