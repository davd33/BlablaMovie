import React, {useState} from 'react';
import {userName, token} from '../../utils';
import axios from 'axios';
import './Movies.css';

function voteForMovie(movie) {
    console.log('vote ', movie);
    axios
        .post(encodeURI(`http://localhost:3001/vote/${movie.imdbID}`), {
            userName: userName(),
            token: token()
        })
        .then(r => console.log(r))
        .catch(r => {
            const errMsg = r.response.data.message;
            const matchMovieNotFoundErr = errMsg.match(new RegExp(`Could not find any entity of type "Movie" matching:[\\s\\S]*imdbID.*${movie.imdbID}[\\s\\S]*`));
            if (matchMovieNotFoundErr && matchMovieNotFoundErr[0] === errMsg) {
                axios.post(`http://localhost:3001/register-movie`, movie)
                    .then(r => console.log(r))
                    .catch(r => console.err(r));

                // retry
                voteForMovie(movie);
            }
        });
}

export function Movies() {

    const [movies, setMovies] = useState([]);

    const m = {"/clear": () => setMovies([])};
    const handleMovieSearch = (e) => m[e.target.value] ? m[e.target.value](e) : axios
          .get(encodeURI(`http://localhost:3001/find-movie?movieName=${e.target.value}`))
          .then(r => { if (r.data.Search) setMovies(r.data.Search); });

    return (
        <div className="find-movies">
          <input type="text" placeholder="search movie" onChange={handleMovieSearch} />

          <div>
            {movies.length < 1 ? "No movies found..." : ""}
            <ul className="movies-found">
              {movies.map((m, i) => <li key={m.imdbID+i}
                                                       onClick={() => voteForMovie(m)}
                                                       className="movie">

                                                     <img src={m.Poster} alt="CLICK HERE TO VOTE" />
                                                     <h1>{m.Title} ({m.Year})</h1>
                                                   </li>)}
            </ul>
          </div>
        </div>
    );
}
