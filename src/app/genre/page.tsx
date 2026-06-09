"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import MoviePagination from "@/components/MoviePagination";
import MovieResults from "@/components/MovieResults";
import Navbar from "@/components/Navbar";
import { AUTH, type Genre, MAX_PAGES, type Movie, mapMovie } from "@/lib/tmdb";

function GenreResults() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get("genre") ?? "";

  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
          { headers: AUTH },
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    getGenres();
  }, []);

  useEffect(() => {
    setSelectedGenres(initialGenre ? [Number(initialGenre)] : []);
    setPage(1);
  }, [initialGenre]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const withGenres = selectedGenres.length
        ? `&with_genres=${selectedGenres.join(",")}`
        : "";
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&page=${page}${withGenres}`,
        { headers: AUTH },
      );

      setTotalPages(Math.min(response.data.total_pages, MAX_PAGES));

      setTotalResults(Math.min(response.data.total_results, MAX_PAGES * 20));
      setMovies(response.data.results.map(mapMovie));
    } catch (error) {
      console.error("Failed to fetch genre movies:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGenres, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const toggleGenre = (id: number) => {
    setPage(1);
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const clearGenres = () => {
    setPage(1);
    setSelectedGenres([]);
  };

  const selectedNames = useMemo(
    () =>
      genres.filter((g) => selectedGenres.includes(g.id)).map((g) => g.name),
    [genres, selectedGenres],
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {selectedNames.length > 0
            ? `${totalResults} titles in "${selectedNames.join(", ")}"`
            : "Movies"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Page {page} of {totalPages || 1}
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          Loading movies...
        </div>
      ) : (
        <MovieResults
          movies={movies}
          availableGenres={genres}
          selectedGenres={selectedGenres}
          onToggle={toggleGenre}
          onClear={clearGenres}
        />
      )}

      <MoviePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}

export default function GenrePage() {
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
        <GenreResults />
      </Suspense>
      <Footer />
    </main>
  );
}
