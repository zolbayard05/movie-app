import { ArrowRight } from "lucide-react";
import MovieCard from "./MovieCard";

type Movie = {
  title: string;
  rating: number;
  image: string;
};

type MovieGroupProps = {
  title: string;
  movies: Movie[];
};

export default function MovieGroup({ title, movies }: MovieGroupProps) {
  return (
    <section className="px-10 py-14 md:px-20">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>

        <button className="flex items-center gap-2 text-sm">
          See more
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie, index) => (
          <MovieCard
            key={index}
            image={movie.image}
            title={movie.title}
            rating={movie.rating}
          />
        ))}
      </div>
    </section>
  );
}
