"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";

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

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1`,
          { headers: { Authorization: TOKEN } },
        );

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
        console.error("Failed to search movies:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchMovies();
    } else {
      setMovies([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search results</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          &ldquo;{query}&rdquo; — {movies.length} results
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
    </section>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <Suspense
        fallback={
          <div className="py-20 text-center text-muted-foreground">
            Loading...
          </div>
        }
      >
        <SearchResults />
      </Suspense>

      <Footer />
    </main>
  );
}
