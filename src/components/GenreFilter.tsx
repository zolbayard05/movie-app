"use client";

import type { Genre } from "@/lib/tmdb";

type Props = {
  genres: Genre[];
  selected: number[];
  onToggle: (genreId: number) => void;
  onClear: () => void;
};

export default function GenreFilter({
  genres,
  selected,
  onToggle,
  onClear,
}: Props) {
  return (
    <aside className="lg:w-56 lg:shrink-0">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Search by genre</h2>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {genres.map((genre) => {
          const active = selected.includes(genre.id);
          return (
            <button
              key={genre.id}
              type="button"
              onClick={() => onToggle(genre.id)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              }`}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
