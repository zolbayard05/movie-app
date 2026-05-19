import { CarouselContainer } from "@/components/CarouselContainer";
import MovieGroup from "@/components/MovieGroup";
import {
  upcomingMovies,
  popularMovies,
  topRatedMovies,
} from "@/components/MovieData";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <CarouselContainer />

      <MovieGroup title="Upcoming" movies={upcomingMovies} />
      <MovieGroup title="Popular" movies={popularMovies} />
      <MovieGroup title="Top Rated" movies={topRatedMovies} />
    </main>
  );
}
