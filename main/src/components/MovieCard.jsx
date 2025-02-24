import React from 'react'
import { Link } from 'react-router'

const MovieCard = ({ movie }) => {
    return (
        <div className='movie-card'>
            <Link to={`/movie/${movie.id}`}>
                <img src={movie.poster_path ? `http://image.tmdb.org/t/p/w500/${movie.poster_path}` : "/no-bg-hor.png"} alt={movie.title} />
            </Link>
            <div className='mt-4'>
                <h3>{movie.title}</h3>
                <div className='rating'>
                    <img src='/star.svg' />
                    <p>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
                    <span className='text-white'>•</span>
                    <p className='lang'>{movie.original_language}</p>
                    <span className='text-white'>•</span>
                    <p className='year'>{movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</p>
                </div>

            </div>
        </div>
    )
}

export default MovieCard