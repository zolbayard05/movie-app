import type { Movie } from "@/app/page";
import MovieCard from "./MovieCard";
import { ArrowRight } from "lucide-react";

type MovieGroupProps = {
  title: string;
  movies: Movie[];
  onSeeMore: () => void;
};

export default function MovieGroup({
  title,
  movies,
  onSeeMore,
}: MovieGroupProps) {
  return (
    <section className="bg-background text-foreground">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>

        <button
          onClick={onSeeMore}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          See more
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {movies.slice(0, 10).map((movie, index) => (
          <MovieCard key={`${movie.title}-${index}`} {...movie} />
        ))}
      </div>
    </section>
  );
}
