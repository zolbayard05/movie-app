"use client";

import GenreFilter from "@/components/GenreFilter";
import MovieCard from "@/components/MovieCard";
import type { Genre, Movie } from "@/lib/tmdb";

type Props = {
  movies: Movie[];
  availableGenres: Genre[];
  selectedGenres: number[];
  onToggle: (genreId: number) => void;
  onClear: () => void;
};

export default function MovieResults({
  movies,
  availableGenres,
  selectedGenres,
  onToggle,
  onClear,
}: Props) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <GenreFilter
        genres={availableGenres}
        selected={selectedGenres}
        onToggle={onToggle}
        onClear={onClear}
      />

      <div className="flex-1">
        {movies.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            No movies match the selected genres.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
