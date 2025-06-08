import axios from "axios";
import { Movie } from "../types/movie";

interface MovieResponse {
  results: Movie[];
}

export default async function movieServices(
  value: string
): Promise<MovieResponse> {
  const response = await axios.get<MovieResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: value,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );

  return response.data;
}
