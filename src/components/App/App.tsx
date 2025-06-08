import "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import { Movie } from "../../types/movie";
import movieServices from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

export default function App() {
  const [value, setValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["movies", value, currentPage],
    queryFn: () => movieServices(value, currentPage),
    enabled: value !== "",
    placeholderData: keepPreviousData,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (isSuccess && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  function openModal(movie: Movie): void {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }
  function closeModal(): void {
    setIsModalOpen(false);
  }

  const totalPages = data?.total_pages ?? 0;

  async function fetchData(newValue: string) {
    setCurrentPage(1);
    setValue(newValue);
  }
  return (
    <>
      <SearchBar onSubmit={(value: string) => fetchData(value)} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <MovieGrid
        onSelect={(movie: Movie) => openModal(movie)}
        movies={data?.results ?? []}
      />
      {isModalOpen && selectedMovie && (
        <MovieModal onClose={() => closeModal()} movie={selectedMovie} />
      )}
      <Toaster />
    </>
  );
}
