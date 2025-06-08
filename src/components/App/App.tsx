import "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import { Movie } from "../../types/movie";
import movieServices from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  function openModal(movie: Movie): void {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }
  function closeModal(): void {
    setIsModalOpen(false);
  }

  async function fetchData(value: string) {
    try {
      setIsLoading(true);
      setIsError(false);
      setMovies([]);
      const data = await movieServices(value);
      if (!data.results.length) {
        toast.error("No movies found for your request.");
      }

      setMovies(data.results);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <SearchBar onSubmit={(value: string) => fetchData(value)} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <MovieGrid
        onSelect={(movie: Movie) => openModal(movie)}
        movies={movies}
      />
      {isModalOpen && selectedMovie && (
        <MovieModal onClose={() => closeModal()} movie={selectedMovie} />
      )}
      <Toaster />
    </>
  );
}
