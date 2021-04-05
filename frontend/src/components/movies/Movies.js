import React, {useEffect, useState} from 'react';
import {userName, token} from '../../utils';
import axios from 'axios';
import * as classNames from 'classnames';
import './Movies.css';

function voteForMovie(movie, cb) {
    axios
        .post(encodeURI(`http://localhost:3001/vote/${movie.imdbID}`), {
            userName: userName(),
            token: token()
        })
        .then(r => cb(r.data))
        .catch(r => {
            const errMsg = r.response.data.message;
            const matchMovieNotFoundErr = errMsg.match(new RegExp(`Could not find any entity of type "Movie" matching:[\\s\\S]*imdbID.*${movie.imdbID}[\\s\\S]*`));
            if (matchMovieNotFoundErr && matchMovieNotFoundErr[0] === errMsg) {
                axios
                    .post(`http://localhost:3001/register-movie`, {
                        ...movie,
                        userName: userName(),
                        token: token()
                    })
                    .then(r => {
                        console.log(r);
                        // retry
                        voteForMovie(movie, cb);
                    })
                    .catch(r => console.log(r));
            }
        });
}

export function Movies() {

    const [movies, setMovies] = useState([]);

    const [inputRef] = useState(React.createRef());
    useEffect(() => {
        inputRef.current.focus();
    });

    const m = {"/clear": () => setMovies([])};
    const handleMovieSearch = (e) => m[e.target.value] ? m[e.target.value](e) : axios
          .post(encodeURI(`http://localhost:3001/find-movie?movieName=${e.target.value}`), {
              userName: userName(),
              token: token()
          })
          .then(r => {
              if (r.data.Search) {
                  setMovies(r.data.Search);
              };
          })
          .catch(r => {
              console.log(r);
          });

    const onVoteSuccess = (data) => {
        console.log('voted!', data);
        setMovies(movies.map(m => m.imdbID === data.movie.imdbID ? {...m, voted: data.foundVote === 0} : m));
    };

    return (
        <div className="find-movies">
          <input ref={inputRef} type="text" placeholder="search movie" onChange={handleMovieSearch} />

          <div>
            {movies.length < 1 ? "No movies found..." : ""}
            <ul className="movies-found">
              {movies.map((m, i) => <li key={m.imdbID+i}
                                        onClick={() => voteForMovie(m, onVoteSuccess)}
                                        className={"movie " + classNames({'voted': m.voted})}>
                                      <img src={m.Poster} alt="CLICK HERE TO VOTE" />
                                      <h1>{m.Title} ({m.Year})</h1>
                                    </li>)}
            </ul>
          </div>
        </div>
    );
}
