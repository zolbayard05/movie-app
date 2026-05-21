import MovieCard from "./MovieCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Movie } from "@/app/page";

type MovieGroupProps = {
  title: string;
  movies: Movie[];
  page: number;
  setPage: (page: number) => void;
};

export default function MovieGroup({
  title,
  movies,
  page,
  setPage,
}: MovieGroupProps) {
  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  return (
    <section className="px-40 py-10">
      <h1 className="mb-4 text-4xl font-bold pb-5">{title}</h1>

      <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie, index) => (
          <MovieCard
            key={index}
            title={movie.title}
            rating={movie.rating}
            image={movie.image}
          />
        ))}
      </div>

      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePrevious} />
          </PaginationItem>

          <PaginationItem>
            <span className="px-4 text-sm font-medium">Page {page}</span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext onClick={handleNext} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
