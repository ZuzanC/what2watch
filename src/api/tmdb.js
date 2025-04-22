const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const fetchMovies = async (query = "") => {
  const endpoint = query
    ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

  const response = await fetch(endpoint, API_OPTIONS);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data;
};

export const fetchTrendingMovies = async () => {
    const endpoint = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
  
    const response = await fetch(endpoint, API_OPTIONS);
  
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
  
    const data = await response.json();
    return data;
  };
