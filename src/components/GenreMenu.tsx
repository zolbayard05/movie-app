"use client";

import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AUTH, type Genre } from "@/lib/tmdb";

export default function GenreMenu() {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenreClick = (genreId: number) => {
    setOpen(false);
    router.push(`/genre?genre=${genreId}`);
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        className="rounded-xl"
        onClick={() => setOpen((prev) => !prev)}
      >
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
        Genre
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[320px] rounded-xl border border-border bg-background p-4 shadow-lg">
          <p className="mb-3 text-sm font-semibold">Genres</p>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                onClick={() => handleGenreClick(genre.id)}
                className="rounded-full border border-border px-3 py-1 text-sm transition-colors hover:bg-accent"
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
