"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import MoviePagination from "@/components/MoviePagination";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { AUTH, type Movie, mapMovie, type TmdbMovie } from "@/lib/tmdb";

function SimilarResults() {
  // useSearchParams нь URL-ийн ?movie=... хэсгийг уншиж авна
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movie") ?? "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // movieId солигдоход 1-р хуудас руу буцаана
  // biome-ignore lint/correctness/useExhaustiveDependencies: movieId солигдоход reset
  useEffect(() => {
    setPage(1);
  }, [movieId]);

  // эх киноны нэрийг авах (гарчигт ашиглана)
  useEffect(() => {
    const getMovieTitle = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          { headers: AUTH },
        );
        setMovieTitle(response.data.title ?? "");
      } catch (error) {
        console.error("Failed to fetch movie title:", error);
      }
    };
    if (movieId) getMovieTitle();
  }, [movieId]);

  const fetchSimilar = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=${page}`,
        { headers: AUTH },
      );
      // TMDB-ийн дээд хязгаар нь 500 хуудас
      setTotalPages(Math.min(response.data.total_pages, 500));
      setMovies(
        response.data.results
          .filter((m: TmdbMovie) => m.poster_path)
          .map(mapMovie),
      );
    } catch (error) {
      console.error("Failed to fetch similar movies:", error);
    } finally {
      setLoading(false);
    }
  }, [movieId, page]);

  useEffect(() => {
    if (movieId) fetchSimilar();
  }, [fetchSimilar, movieId]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {movieTitle ? `More like ${movieTitle}` : "More like this"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Page {page} of {totalPages || 1}
          </p>
        </div>

        {movieId && (
          <Link href={`/movie/${movieId}`}>
            <Button variant="outline">Back</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          Loading movies...
        </div>
      ) : movies.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No similar movies found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      )}

      <MoviePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}

export default function SimilarPage() {
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
        <SimilarResults />
      </Suspense>
      <Footer />
    </main>
  );
}
