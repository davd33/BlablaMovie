import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {

    const [movies, setMovies] = useState([]);

    const handleMovieSearch = (e) => axios
          .get(encodeURI(`http://localhost:3001/find-movie?movieName=${e.target.value}`))
          .then(r => setMovies(r.data.Search || movies));

    return (
        <div className="App">
          <input type="text" placeholder="search movie" onChange={handleMovieSearch} />

          <div>
            {movies.length < 1 ? "No movies found..." : ""}
            <ul className="moviesFound">
              {movies.map(m => <li key={m.imdbID}><img src={m.Poster} /><h1>{m.Title} ({m.Year})</h1></li>)}
            </ul>
          </div>
        </div>
    );
}

export default App;
