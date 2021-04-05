import React, {useState} from 'react';
import axios from 'axios';
import {
    useHistory
} from "react-router-dom";

export function Register({onSuccess}) {

    const [errMsg, setErrMsg] = useState("");
    const [name, setName] = useState("");
    const [password, setPw] = useState("");

    const history = useHistory();

    const submit = () => {
        axios
            .post(`http://localhost:3001/users`, {name, password})
            .then(r => onSuccess(history))
            .catch(r => {
                if (r.response.data.message.startsWith("duplicate key value violates unique constraint")) {
                    setErrMsg("User already exists.");
                }
            });
    };

    const nameChanged = (e) => setName(e.target.value);

    const passwordChanged = (e) => setPw(e.target.value);

    return (
        <div className="form">
          <p>Fill the form in to create your user.</p>
          <div><em>{errMsg}</em></div>
          <label>User name <input type="text" onChange={nameChanged} /></label>
          <br />
          <label>Password <input type="password" onChange={passwordChanged} /></label>
          <br />
          <div className="submit"><button onClick={submit}>Register</button></div>
        </div>
    );
}
