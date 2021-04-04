import React, {useState} from 'react';
import axios from 'axios';

export function Register({onSuccess}) {

    const [errMsg, setErrMsg] = useState("");
    const [name, setName] = useState("");

    const submit = () => {
        axios
            .post(`http://localhost:3001/users`, {name})
            .then(r => onSuccess(r.data))
            .catch(r => setErrMsg(`Error: ${r.message}`));
    };

    const nameChanged = (e) => setName(e.target.value);

    return (
        <div>
          <div><em>{errMsg}</em></div>
          <input type="text" onChange={nameChanged} />
          <button onClick={submit}>Register</button>
        </div>
    );
}
