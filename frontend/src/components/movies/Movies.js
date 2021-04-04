import React, {useState} from 'react';
import axios from 'axios';
import './Movies.css';

export function Movies() {

    const [movies, setMovies] = useState([]);

    const m = {"/clear": () => setMovies([])};
    const handleMovieSearch = (e) => m[e.target.value] ? m[e.target.value](e) : axios
          .get(encodeURI(`http://localhost:3001/find-movie?movieName=${e.target.value}`))
          .then(r => { if (r.data.Search) setMovies(r.data.Search); });

    const voteForMovie = (movieId) => {console.log('vote '+ movieId);};

    return (
        <div>
          <input type="text" placeholder="search movie" onChange={handleMovieSearch} />

          <div>
            {movies.length < 1 ? "No movies found..." : ""}
            <ul className="movies-found">
              {movies.map((m, i) => <li key={m.imdbID+i} onClick={() => voteForMovie(m.imdbID)} className="movie">
                                      <img src={m.Poster} alt="VOTE" />
                                      <h1>{m.Title} ({m.Year})</h1>
                                    </li>)}
            </ul>
          </div>
        </div>
    );
}
