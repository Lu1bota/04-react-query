import axios from "axios";
import { Movie } from "../types/movie";

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export default async function movieServices(
  value: string,
  page: number
): Promise<MovieResponse> {
  const response = await axios.get<MovieResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: value,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  console.log(response.data);

  return response.data;
}
