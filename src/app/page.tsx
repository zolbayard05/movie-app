"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { CarouselContainer } from "@/components/CarouselContainer";
import Footer from "@/components/Footer";
import HomePageSkeleton from "@/components/HomePageSkeleton";
import MovieGroup from "@/components/MovieGroup";
import Navbar from "@/components/Navbar";
import { AUTH, type Movie, mapMovie } from "@/lib/tmdb";

type Group = "now_playing" | "upcoming" | "popular" | "top_rated";

export default function Home() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = useCallback(
    async (group: Group, setMovieData: (movies: Movie[]) => void) => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${group}?language=en-US&page=1`,
          { headers: AUTH },
        );
        setMovieData(response.data.results.map(mapMovie));
      } catch (error) {
        console.error(`Failed to fetch ${group}:`, error);
      }
    },
    [],
  );

  useEffect(() => {
    Promise.all([
      fetchMovies("now_playing", setNowPlayingMovies),
      fetchMovies("upcoming", setUpcomingMovies),
      fetchMovies("popular", setPopularMovies),
      fetchMovies("top_rated", setTopRatedMovies),
    ]).finally(() => setLoading(false));
  }, [fetchMovies]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <HomePageSkeleton />
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto w-full px-6 py-8">
        <CarouselContainer movies={nowPlayingMovies} />
      </section>

      <section className="mx-auto max-w-7xl space-y-14 px-6 pb-20">
        <MovieGroup
          title="Now Playing"
          movies={nowPlayingMovies}
          href="/category?type=now_playing"
        />
        <MovieGroup
          title="Upcoming"
          movies={upcomingMovies}
          href="/category?type=upcoming"
        />
        <MovieGroup
          title="Popular"
          movies={popularMovies}
          href="/category?type=popular"
        />
        <MovieGroup
          title="Top Rated"
          movies={topRatedMovies}
          href="/category?type=top_rated"
        />
      </section>

      <Footer />
    </main>
  );
}
