import React, {useState} from 'react';
import axios from 'axios';

export function Register({onSuccess}) {

    const [errMsg, setErrMsg] = useState("");
    const [name, setName] = useState("");
    const [password, setPw] = useState("");

    const submit = () => {
        axios
            .post(`http://localhost:3001/users`, {name, password})
            .then(r => onSuccess(r.data))
            .catch(r => {console.log(r);setErrMsg(`Error: ${r.message}`);});
    };

    const nameChanged = (e) => setName(e.target.value);

    const passwordChanged = (e) => setPw(e.target.value);

    return (
        <div class="form">
          <div><em>{errMsg}</em></div>
          <label>User name <input type="text" onChange={nameChanged} /></label>
          <br />
          <label>Password <input type="text" onChange={passwordChanged} /></label>
          <br />
          <div class="submit"><button onClick={submit}>Register</button></div>
        </div>
    );
}
