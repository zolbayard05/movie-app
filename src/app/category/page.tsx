"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import MoviePagination from "@/components/MoviePagination";
import MovieResults from "@/components/MovieResults";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { AUTH, type Genre, MAX_PAGES, type Movie, mapMovie } from "@/lib/tmdb";

const TITLES: Record<string, string> = {
  now_playing: "Now Playing",
  upcoming: "Upcoming",
  popular: "Popular",
  top_rated: "Top Rated",
};

function CategoryResults() {
  // useSearchParams нь URL-ийн ?type=... хэсгийг уншиж авна
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "popular";
  const title = TITLES[type] ?? "Movies";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // genre жагсаалтыг нэг удаа татна
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

  // type солигдоход хуудас ба genre шүүлтийг цэвэрлэнэ
  // biome-ignore lint/correctness/useExhaustiveDependencies: type солигдоход reset
  useEffect(() => {
    setPage(1);
    setSelectedGenres([]);
  }, [type]);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${type}?language=en-US&page=${page}`,
        { headers: AUTH },
      );
      setTotalPages(Math.min(response.data.total_pages, MAX_PAGES));
      setMovies(response.data.results.map(mapMovie));
    } catch (error) {
      console.error("Failed to fetch category movies:", error);
    } finally {
      setLoading(false);
    }
  }, [type, page]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // зөвхөн үр дүнд байгаа genre-уудыг шүүлтийн товч болгоно
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Page {page} of {totalPages || 1}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          Loading movies...
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

      <MoviePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}

export default function CategoryPage() {
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
        <CategoryResults />
      </Suspense>
      <Footer />
    </main>
  );
}
