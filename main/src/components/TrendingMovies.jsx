import MovieCard from './MovieCard';

const TrendingMovies = ({ movies }) => {
    return (
        <section className='trending'>
            <ul className='text-white'>
                {movies.map(movie => (<MovieCard movie={movie} key={movie.id} />))}
            </ul>
        </section>
    )
}

export default TrendingMovies