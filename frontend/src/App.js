import React, {useState} from 'react';
import './App.css';
import axios from 'axios';
import {Movies} from './components/movies/Movies.js';
import {Register} from './components/register/Register.js';

export function Login({onSuccess}) {

    const [errMsg, setErrMsg] = useState("");
    const [name, setName] = useState("");

    const submit = () => {
        axios
            .get(`http://localhost:3001/login?userName=${encodeURI(name)}`)
            .then(r => onSuccess(r.data))
            .catch(r => setErrMsg(`Error: ${r.message}`));
    };

    const nameChanged = (e) => setName(e.target.value);

    return (
        <div>
          <div><em>{errMsg}</em></div>
          <input type="text" onChange={nameChanged}/>
          <button onClick={submit}>Sign in!</button>
        </div>
    );
}

function App() {

    return (
        <div className="App">
          <Register onSuccess={(data) => alert(`yay! ${data}`)}/>
          <hr/>
          <Login onSuccess={(data) => alert(`logged in! ${data}`)}/>
        </div>
    );
}

export default App;
