"use client";

import axios from "axios";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { AUTH } from "@/lib/tmdb";

type Suggestion = {
  id: number;
  title: string;
  image: string;
  year: string;
};

type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

export default function SearchBox() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const value = search.trim();
    if (!value) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            value,
          )}&language=en-US&page=1`,
          { headers: AUTH },
        );
        setSuggestions(
          response.data.results.slice(0, 6).map((movie: TmdbMovie) => ({
            id: movie.id,
            title: movie.title,
            image: movie.poster_path
              ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
              : "",
            year: movie.release_date ? movie.release_date.slice(0, 4) : "",
          })),
        );
        setShow(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const value = search.trim();
    if (!value) return;
    setShow(false);
    router.push(`/search?query=${encodeURIComponent(value)}`);
  };

  const handleSuggestionClick = (movieId: number) => {
    setShow(false);
    setSearch("");
    router.push(`/movie/${movieId}`);
  };

  return (
    <div className="relative w-full md:w-auto" ref={ref}>
      <InputGroup className="w-full rounded-xl bg-background md:w-[380px]">
        <InputGroupInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShow(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <InputGroupAddon align="inline-start">
          <button type="button" onClick={handleSearch}>
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </button>
        </InputGroupAddon>
      </InputGroup>

      {show && suggestions.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {suggestions.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => handleSuggestionClick(movie.id)}
              className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-accent"
            >
              {movie.image ? (
                <div className="relative h-[60px] w-[40px] shrink-0">
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    fill
                    sizes="40px"
                    className="rounded-md object-cover"
                  />
                </div>
              ) : (
                <div className="h-[60px] w-[40px] shrink-0 rounded-md bg-muted" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{movie.title}</p>
                {movie.year && (
                  <p className="text-xs text-muted-foreground">{movie.year}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
