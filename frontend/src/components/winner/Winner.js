import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Winner.css';

export function Winner() {
    const [winner, setWinner] = useState(null);
    useEffect(() => {
        axios
            .get(`http://localhost:3001/winner`)
            .then(r => setWinner(r.data[0]));
    });

    return !!winner ? (
             <div className="winner">
               <img src={winner.m_poster} alt="And the winner is:" />
               <h1>{winner.m_title} ({winner.m_year})</h1>
             </div>) : "...";
}
