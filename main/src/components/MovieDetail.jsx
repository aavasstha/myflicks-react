import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

// api variables
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

const MovieDetail = () => {
    const { id } = useParams(); // Get movie ID from URL
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/movie/${id}?language=en-US`, API_OPTIONS);
                if (!response.ok) throw new Error("Movie not found");
                const data = await response.json();
                setMovie(data)

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <h1 className="text-center text-red-500">{error}</h1>;

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
            {movie && (
                <div className="max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
                    {/* Movie Poster */}
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-80 rounded-lg mb-4"
                    />

                    {/* Movie Title & Tagline */}
                    <h1 className="text-3xl font-bold">{movie.title}</h1>
                    <p className="italic text-pink-400">{movie.tagline}</p>

                    {/* Release Date & Runtime */}
                    <p className="mt-2">
                        <span className="font-bold">Release Date:</span> {movie.release_date}
                    </p>
                    <p>
                        <span className="font-bold">Runtime:</span> {movie.runtime} minutes
                    </p>

                    {/* Genres */}
                    <p className="mt-2">
                        <span className="font-bold">Genres:</span> {movie.genres.map(g => g.name).join(", ")}
                    </p>

                    {/* Overview */}
                    <p className="mt-4">{movie.overview}</p>

                    {/* Production Companies */}
                    <p className="mt-2">
                        <span className="font-bold">Production Companies:</span>{" "}
                        {movie.production_companies.map(company => company.name).join(", ")}
                    </p>

                    {/* Production Countries */}
                    <p>
                        <span className="font-bold">Production Countries:</span>{" "}
                        {movie.production_countries.map(country => country.name).join(", ")}
                    </p>

                    {/* Spoken Languages */}
                    <p>
                        <span className="font-bold">Languages:</span>{" "}
                        {movie.spoken_languages.map(lang => lang.english_name).join(", ")}
                    </p>

                    {/* Ratings */}
                    <p className="mt-2">
                        <span className="font-bold">Rating:</span> ⭐ {movie.vote_average} ({movie.vote_count} votes)
                    </p>

                    {/* Revenue & Budget */}
                    <p>
                        <span className="font-bold">Budget:</span> ${movie.budget.toLocaleString()}
                    </p>
                    <p>
                        <span className="font-bold">Revenue:</span> ${movie.revenue.toLocaleString()}
                    </p>

                    {/* Homepage Link */}
                    {movie.homepage && (
                        <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline mt-4 block">
                            Official Website
                        </a>
                    )}

                    {/* Back Button */}
                    <button
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-md hover:opacity-80 transition"
                        onClick={() => window.history.back()}
                    >
                        Back to Movies
                    </button>
                </div>
            )}
        </div>
    );
};

export default MovieDetail;
