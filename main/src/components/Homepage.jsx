import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import MovieCard from './MovieCard';
import { useDebounce } from 'react-use';
import TrendingMovies from './TrendingMovies';
import NavBar from './Navbar';
import Search from './Search';
import { useNavigate } from 'react-router-dom';

// API variables
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

const Homepage = () => {

    // States
    const [searchTerm, setSearchTerm] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);
    const [moviesList, setMoviesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [trendingMoviesList, setTrendingMoviesList] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    // Debounce search input to reduce API calls
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Convert token to boolean
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token from localStorage
        setIsLoggedIn(false);
        navigate("/login"); // Redirect to login page
    };

    // Fetch movies by popularity or search
    const fetchMovies = async (query = "") => {
        setIsLoading(true);
        setErrorMsg("");

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${query}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await response.json();

            if (data.Response === 'False') {
                setErrorMsg(data.error || 'Failed to fetch movies');
                setMoviesList([]);
                return;
            }

            setMoviesList(data.results || []);
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch trending movies
    const fetchTrendingMovies = async () => {
        setIsLoading(true);
        setErrorMsg("");

        try {
            const response = await fetch(`${API_BASE_URL}/trending/movie/day?language=en-US`, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await response.json();

            setTrendingMoviesList(data.results.slice(0, 10)); // Show top 10 trending movies
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchTrendingMovies();
    }, []);

    return (
        <main>
            {/* Main Content */}
            <div className='pattern' />
            <div className='wrapper'>
                <header className="text-center">
                    <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                    <img src="/hero.png" alt='hero banner' className="mx-auto" />
                    <h1>Find <span className='text-gradient'> Movies </span>You'll Enjoy Without Any Hassle</h1>
                </header>

                {isLoggedIn ?
                    <>
                        <section>
                            <h2>Trending Movies</h2>
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : errorMsg ? (
                                <p className='text-red-500'>{errorMsg}</p>
                            ) : (
                                <TrendingMovies movies={trendingMoviesList} />
                            )}
                        </section>
                        <section className='search'>
                            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        </section>
                        <section className='all-movies'>
                            <h2 className='mt-[25px]'>All Movies</h2>
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : errorMsg ? (
                                <p className='text-red-500'>{errorMsg}</p>
                            ) : (
                                <ul>{moviesList.map((movie) => <MovieCard movie={movie} key={movie.id} />)}</ul>
                            )}
                        </section>
                    </>
                    : <p className="text-white text-lg font-semibold bg-darkblue-500 px-4 py-2 rounded-md shadow-md text-center animate-pulse">
                        🚀 Please Log in or Sign Up to explore amazing movies! 🎬
                    </p>
                }





            </div>
        </main>
    );
};

export default Homepage;
