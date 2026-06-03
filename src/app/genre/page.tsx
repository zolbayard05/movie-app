"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI4YTA3MzQ4ZGQ0YzI5NDM0ZDNjOTVmZTE4MDM1MCIsIm5iZiI6MTc3OTI3NDQyNS45OSwic3ViIjoiNmEwZDkyYjlmNGM0M2VmMTNjYjgxNWQ3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-P7ht59CToEV7YtGXVaI6zqc-VOe-Rwkn_x1uLA3n6I";

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

type Genre = {
  id: number;
  name: string;
};

function GenreResults() {
  // useSearchParams нь URL-ийн ?genre=... хэсгийг уншиж авна
  const searchParams = useSearchParams();
  const genreId = searchParams.get("genre") ?? "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreName, setGenreName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // genreId солигдох бүрт 1-р хуудас руу буцаана
  // biome-ignore lint/correctness/useExhaustiveDependencies: setPage is stable
  useEffect(() => {
    setPage(1);
  }, [genreId]);

  // genre-ийн нэрийг авах (id -> name)
  useEffect(() => {
    const getGenreName = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
          { headers: { Authorization: TOKEN } },
        );
        const found = response.data.genres.find(
          (g: Genre) => String(g.id) === genreId,
        );
        setGenreName(found ? found.name : "Genre");
      } catch (error) {
        console.error("Failed to fetch genre name:", error);
      }
    };

    if (genreId) getGenreName();
  }, [genreId]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&sort_by=popularity.desc&page=${page}`,
        { headers: { Authorization: TOKEN } },
      );

      // TMDB-ийн дээд хязгаар нь 500 хуудас
      setTotalPages(Math.min(response.data.total_pages, 500));

      const movieData = response.data.results.map((movie: TmdbMovie) => ({
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
    } catch (error) {
      console.error("Failed to fetch genre movies:", error);
    } finally {
      setLoading(false);
    }
  }, [genreId, page]);

  useEffect(() => {
    if (genreId) {
      fetchMovies();
    } else {
      setMovies([]);
      setLoading(false);
    }
  }, [fetchMovies, genreId]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{genreName}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page} of {totalPages || 1}
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          Loading movies...
        </div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No movies found.
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

export default function GenrePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* useSearchParams ашигладаг тул заавал Suspense-ээр ороох ёстой */}
      <Suspense
        fallback={
          <div className="py-20 text-center text-muted-foreground">
            Loading...
          </div>
        }
      >
        <GenreResults />
      </Suspense>

      <Footer />
    </main>
  );
}
