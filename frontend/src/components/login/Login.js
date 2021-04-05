import React, {useState} from 'react';
import axios from 'axios';
import {
    useHistory
} from "react-router-dom";

export function Login({onSuccess}) {

    const [errMsg, setErrMsg] = useState("");
    const [name, setName] = useState("");
    const [password, setPw] = useState("");

    const history = useHistory();

    const submit = () => {
        axios
            .post(`http://localhost:3001/users/login`, {userName: name, password})
            .then(r => onSuccess(name, r.data, history))
            .catch(r => {
                if (r.response.data.message.startsWith('Could not find any entity of type "BlablaUser"')) {
                    setErrMsg("Wrong user or password.");
                }
            });
    };

    const nameChanged = (e) => setName(e.target.value);

    const passwordChanged = (e) => setPw(e.target.value);

    return (
        <div className="form">
          <p>Enter your login information to sign in.</p>
          <div><em>{errMsg}</em></div>
          <label>
            User name <input type="text" onChange={nameChanged}/>
          </label>
          <label>
            Password <input type="password" onChange={passwordChanged}/>
          </label>

          <div className="submit"><button onClick={submit}>Sign in!</button></div>
        </div>
    );
}
