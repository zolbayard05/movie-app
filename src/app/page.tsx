"use client";

import { CarouselContainer } from "@/components/CarouselContainer";
import MovieGroup from "@/components/MovieGroup";
import axios from "axios";
import { useEffect, useState } from "react";

export type Movie = {
  title: string;
  rating: number;
  image: string;
  backdrop: string;
  overview: string;
};

type TmdbMovie = {
  title: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
};

export default function Home() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);

  const [nowPlayingPage, setNowPlayingPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);

  const fetchMovies = async (
    group: "upcoming" | "popular" | "top_rated" | "now_playing",
    page: number,
    setMovieData: (movies: Movie[]) => void,
  ) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${group}?language=en-US&page=${page}`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI4YTA3MzQ4ZGQ0YzI5NDM0ZDNjOTVmZTE4MDM1MCIsIm5iZiI6MTc3OTI3NDQyNS45OSwic3ViIjoiNmEwZDkyYjlmNGM0M2VmMTNjYjgxNWQ3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-P7ht59CToEV7YtGXVaI6zqc-VOe-Rwkn_x1uLA3n6I",
          accept: "application/json",
        },
      },
    );

    const movies = response.data.results.map((movie: TmdbMovie) => ({
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

    setMovieData(movies);
  };

  useEffect(() => {
    fetchMovies("now_playing", nowPlayingPage, setNowPlayingMovies);
  }, [nowPlayingPage]);

  useEffect(() => {
    fetchMovies("upcoming", upcomingPage, setUpcomingMovies);
  }, [upcomingPage]);

  useEffect(() => {
    fetchMovies("popular", popularPage, setPopularMovies);
  }, [popularPage]);

  useEffect(() => {
    fetchMovies("top_rated", topRatedPage, setTopRatedMovies);
  }, [topRatedPage]);

  return (
    <main className="min-h-screen bg-white">
      <CarouselContainer movies={nowPlayingMovies} />

      <MovieGroup
        title="Upcoming"
        movies={upcomingMovies}
        page={upcomingPage}
        setPage={setUpcomingPage}
      />

      <MovieGroup
        title="Popular"
        movies={popularMovies}
        page={popularPage}
        setPage={setPopularPage}
      />

      <MovieGroup
        title="Top Rated"
        movies={topRatedMovies}
        page={topRatedPage}
        setPage={setTopRatedPage}
      />
    </main>
  );
}
