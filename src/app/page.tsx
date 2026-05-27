"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieGroup from "@/components/MovieGroup";
import CategoryView from "@/components/CategoryPage";
import { CarouselContainer } from "@/components/CarouselContainer";

export type Movie = {
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

export default function Home() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    category: string;
  } | null>(null);

  const fetchMovies = async (
    group: "now_playing" | "upcoming" | "popular" | "top_rated",
    setMovieData: (movies: Movie[]) => void,
  ) => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${group}?language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI4YTA3MzQ4ZGQ0YzI5NDM0ZDNjOTVmZTE4MDM1MCIsIm5iZiI6MTc3OTI3NDQyNS45OSwic3ViIjoiNmEwZDkyYjlmNGM0M2VmMTNjYjgxNWQ3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-P7ht59CToEV7YtGXVaI6zqc-VOe-Rwkn_x1uLA3n6I`,
        },
      },
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

    setMovieData(movieData);
  };

  useEffect(() => {
    fetchMovies("now_playing", setNowPlayingMovies);
    fetchMovies("upcoming", setUpcomingMovies);
    fetchMovies("popular", setPopularMovies);
    fetchMovies("top_rated", setTopRatedMovies);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {selectedCategory ? (
        <CategoryView
          title={selectedCategory.title}
          category={selectedCategory.category}
          onBack={() => setSelectedCategory(null)}
        />
      ) : (
        <>
          <section className="mx-auto w-full px-6 py-8">
            <CarouselContainer movies={nowPlayingMovies} />
          </section>

          <section className="mx-auto max-w-7xl space-y-14 px-6 pb-20">
            <MovieGroup
              title="Now Playing"
              movies={nowPlayingMovies}
              onSeeMore={() =>
                setSelectedCategory({
                  title: "Now Playing",
                  category: "now_playing",
                })
              }
            />

            <MovieGroup
              title="Upcoming"
              movies={upcomingMovies}
              onSeeMore={() =>
                setSelectedCategory({
                  title: "Upcoming",
                  category: "upcoming",
                })
              }
            />

            <MovieGroup
              title="Popular"
              movies={popularMovies}
              onSeeMore={() =>
                setSelectedCategory({
                  title: "Popular",
                  category: "popular",
                })
              }
            />

            <MovieGroup
              title="Top Rated"
              movies={topRatedMovies}
              onSeeMore={() =>
                setSelectedCategory({
                  title: "Top Rated",
                  category: "top_rated",
                })
              }
            />
          </section>
        </>
      )}

      <Footer />
    </main>
  );
}
