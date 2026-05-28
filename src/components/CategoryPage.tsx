"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Movie = {
  id: number;
  title: string;
  rating: number;
  image: string;
  backdrop: string;
  overview: string;
};

type TmdbMovie = {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
};

type CategoryViewProps = {
  category: string;
  title: string;
  onBack: () => void;
};

const MOVIES_PER_PAGE = 10;
const TMDB_PER_PAGE = 20;

export default function CategoryView({
  category,
  title,
  onBack,
}: CategoryViewProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalMovieCount, setTotalMovieCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(totalMovieCount / MOVIES_PER_PAGE);

  // biome-ignore lint/correctness/useExhaustiveDependencies: setPage is stable
  useEffect(() => {
    setPage(1);
  }, [category]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const startIndex = (page - 1) * MOVIES_PER_PAGE;
      const endIndex = startIndex + MOVIES_PER_PAGE;

      const startApiPage = Math.floor(startIndex / TMDB_PER_PAGE) + 1;
      const endApiPage = Math.floor((endIndex - 1) / TMDB_PER_PAGE) + 1;

      const requests = [];

      for (let apiPage = startApiPage; apiPage <= endApiPage; apiPage++) {
        requests.push(
          axios.get(
            `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${apiPage}`,
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI4YTA3MzQ4ZGQ0YzI5NDM0ZDNjOTVmZTE4MDM1MCIsIm5iZiI6MTc3OTI3NDQyNS45OSwic3ViIjoiNmEwZDkyYjlmNGM0M2VmMTNjYjgxNWQ3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-P7ht59CToEV7YtGXVaI6zqc-VOe-Rwkn_x1uLA3n6I`,
              },
            },
          ),
        );
      }

      const responses = await Promise.all(requests);

      setTotalMovieCount(responses[0].data.total_results);

      const combinedResults: TmdbMovie[] = responses.flatMap(
        (response) => response.data.results,
      );

      const sliceStart = startIndex % TMDB_PER_PAGE;
      const currentPageResults = combinedResults.slice(
        sliceStart,
        sliceStart + MOVIES_PER_PAGE,
      );

      const movieData = currentPageResults.map((movie) => ({
        id: movie.id,
        title: movie.title,
        rating: movie.vote_average,
        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "",
        backdrop: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : "",
        overview: movie.overview,
      }));

      setMovies(movieData);
    } finally {
      setLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const paginationItems = useMemo(() => {
    const pages: number[] = [];

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1) return;
    if (pageNumber > totalPages) return;

    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Page {page} of {totalPages || 1}
          </p>
        </div>

        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          Loading movies...
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(page - 1)}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {page > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => goToPage(1)}
                    className="cursor-pointer"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <span className="px-2 text-muted-foreground">...</span>
                </PaginationItem>
              </>
            )}

            {paginationItems.map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={page === pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className="cursor-pointer"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}

            {page < totalPages - 2 && (
              <>
                <PaginationItem>
                  <span className="px-2 text-muted-foreground">...</span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    onClick={() => goToPage(totalPages)}
                    className="cursor-pointer"
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(page + 1)}
                className={
                  page === totalPages || totalPages === 0
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
