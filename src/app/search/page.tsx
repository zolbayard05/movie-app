"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import MovieResults from "@/components/MovieResults";
import Navbar from "@/components/Navbar";
import { AUTH, type Genre, type Movie, mapMovie } from "@/lib/tmdb";

function SearchResults() {
  // useSearchParams нь URL-ийн ?query=... хэсгийг уншиж авна
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // genre жагсаалтыг нэг удаа татна (id -> name)
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

  // хайлтын үр дүнг татна
  useEffect(() => {
    const searchMovies = async () => {
      setLoading(true);
      setSelectedGenres([]); // шинэ хайлт хийхэд genre шүүлтийг цэвэрлэнэ
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            query,
          )}&language=en-US&page=1`,
          { headers: AUTH },
        );
        setMovies(response.data.results.map(mapMovie));
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

  // зөвхөн үр дүнд байгаа genre-уудыг шүүлтийн товч болгож харуулна
  const availableGenres = useMemo(
    () => genres.filter((g) => movies.some((m) => m.genreIds.includes(g.id))),
    [genres, movies],
  );

  // сонгосон бүх genre-г агуулсан кино (давхар шүүлт = AND)
  const filteredMovies = useMemo(() => {
    if (selectedGenres.length === 0) return movies;
    return movies.filter((m) =>
      selectedGenres.every((id) => m.genreIds.includes(id)),
    );
  }, [movies, selectedGenres]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search results</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          &ldquo;{query}&rdquo; — {filteredMovies.length} results
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
        <MovieResults
          movies={filteredMovies}
          availableGenres={availableGenres}
          selectedGenres={selectedGenres}
          onToggle={toggleGenre}
          onClear={() => setSelectedGenres([])}
        />
      )}
    </section>
  );
}

export default function SearchPage() {
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
        <SearchResults />
      </Suspense>
      <Footer />
    </main>
  );
}
