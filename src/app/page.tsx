"use client";
import { CarouselContainer } from "@/components/CarouselContainer";
import MovieGroup from "@/components/MovieGroup";
import axios from "axios";
import {
  upcomingMovies,
  popularMovies,
  topRatedMovies,
} from "@/components/MovieData";
import { useState, useEffect } from "react";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(
      "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI4YTA3MzQ4ZGQ0YzI5NDM0ZDNjOTVmZTE4MDM1MCIsIm5iZiI6MTc3OTI3NDQyNS45OSwic3ViIjoiNmEwZDkyYjlmNGM0M2VmMTNjYjgxNWQ3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-P7ht59CToEV7YtGXVaI6zqc-VOe-Rwkn_x1uLA3n6I",
        },
      },
    );
    .then((response) => {
      setMovies(response.data.results);
    });
  },[]);

  return (
    <main className="min-h-screen bg-white">
      <CarouselContainer />

      <MovieGroup title="Upcoming" movies={upcomingMovies} />
      <MovieGroup title="Popular" movies={popularMovies} />
      <MovieGroup title="Top Rated" movies={topRatedMovies} />
    </main>
  );
}
