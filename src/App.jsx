import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { fetchMovies } from "./api/tmdb";
import { fetchTrendingMovies } from "./api/tmdb";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const handleFetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await fetchMovies(query);

      if (!data.results || data.results.length === 0) {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const data = await fetchTrendingMovies();
      console.log(data);

      if (!data.results || data.results.length === 0) {
        setErrorMessage(data.Error || "Failed to fetch trending movies");
        setTrendingMovies([]);
        return;
      } else {
        const topFive = data.results.slice(0, 5);
        setTrendingMovies(topFive || []);
      }
    } catch {
      console.error(`Error fetching trending movies:${error}`);
    }
  };

  useEffect(() => {
    handleFetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header className="sm:mt-10 mt-5">
          <h1 className="text-left">
            Find your favourite{" "}
            <span className="text-gradient">Movies & TV SHOWS</span>
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && searchTerm.length == 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                        : "no-movie.png"
                    }
                    alt={movie.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>{searchTerm.length == 0 ? "All movies" : `Results for "${searchTerm}"`}</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
