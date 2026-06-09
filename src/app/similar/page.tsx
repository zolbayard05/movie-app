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
import {
  AUTH,
  MAX_PAGES,
  MODERN_FROM,
  type Movie,
  mapMovie,
  type TmdbMovie,
} from "@/lib/tmdb";

function SimilarResults() {
  // useSearchParams нь URL-ийн ?movie=... хэсгийг уншиж авна
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movie") ?? "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieTitle, setMovieTitle] = useState("");
  // null = эх кино хараахан ачаалаагүй (genre мэдэгдэхгүй)
  const [movieGenres, setMovieGenres] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // movieId солигдоход 1-р хуудас руу буцаана
  // biome-ignore lint/correctness/useExhaustiveDependencies: movieId солигдоход reset
  useEffect(() => {
    setPage(1);
    setMovieGenres(null);
  }, [movieId]);

  // эх киноны нэр + genre-уудыг авах
  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          { headers: AUTH },
        );
        setMovieTitle(response.data.title ?? "");
        setMovieGenres(
          (response.data.genres ?? [])
            .slice(0, 3)
            .map((g: { id: number }) => g.id)
            .join(","),
        );
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };
    if (movieId) getMovie();
  }, [movieId]);

  const fetchSimilar = useCallback(async () => {
    if (movieGenres === null) return; // эх кино ачаалагдтал хүлээнэ
    setLoading(true);
    try {
      const withGenres = movieGenres ? `&with_genres=${movieGenres}` : "";
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&primary_release_date.gte=${MODERN_FROM}&page=${page}${withGenres}`,
        { headers: AUTH },
      );
      // хамгийн ихдээ ~2000 кино (100 хуудас)
      setTotalPages(Math.min(response.data.total_pages, MAX_PAGES));
      setMovies(
        response.data.results
          .filter((m: TmdbMovie) => m.poster_path && String(m.id) !== movieId)
          .map(mapMovie),
      );
    } catch (error) {
      console.error("Failed to fetch similar movies:", error);
    } finally {
      setLoading(false);
    }
  }, [movieGenres, page, movieId]);

  useEffect(() => {
    fetchSimilar();
  }, [fetchSimilar]);

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
