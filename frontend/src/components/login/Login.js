import React, {useState} from 'react';
import axios from 'axios';

export function Login({onSuccess}) {

    const [errMsg, setErrMsg] = useState("");
    const [name, setName] = useState("");
    const [password, setPw] = useState("");

    const submit = () => {
        axios
            .post(`http://localhost:3001/users/login`, {userName: name, password})
            .then(r => onSuccess(r.data))
            .catch(r => setErrMsg(`Error: ${r.message}`));
    };

    const nameChanged = (e) => setName(e.target.value);

    const passwordChanged = (e) => setPw(e.target.value);

    return (
        <div class="form">
          <div><em>{errMsg}</em></div>
          <label>
            User name <input type="text" onChange={nameChanged}/>
          </label>
          <label>
            Password <input type="text" onChange={passwordChanged}/>
          </label>

          <div class="submit"><button onClick={submit}>Sign in!</button></div>
        </div>
    );
}
