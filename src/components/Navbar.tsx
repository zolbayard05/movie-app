"use client";

import axios from "axios";
import { ChevronDown, FilmIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI4YTA3MzQ4ZGQ0YzI5NDM0ZDNjOTVmZTE4MDM1MCIsIm5iZiI6MTc3OTI3NDQyNS45OSwic3ViIjoiNmEwZDkyYjlmNGM0M2VmMTNjYjgxNWQ3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-P7ht59CToEV7YtGXVaI6zqc-VOe-Rwkn_x1uLA3n6I";

type Genre = {
  id: number;
  name: string;
};

const Navbar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [genres, setGenres] = useState<Genre[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // genre жагсаалтыг нэг удаа татна
  useEffect(() => {
    const getGenres = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
          { headers: { Authorization: TOKEN } },
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    getGenres();
  }, []);

  // dropdown-ийн гадна дарвал хаагдана
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const value = search.trim();
    if (!value) return;

    // /search?query=... руу шилжүүлнэ (стандарт арга)
    router.push(`/search?query=${encodeURIComponent(value)}`);
  };

  const handleGenreClick = (genreId: number) => {
    setOpen(false);
    router.push(`/genre?genre=${genreId}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 text-foreground backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-primary p-2 text-primary-foreground">
            <FilmIcon size={20} />
          </div>

          <span className="text-xl font-bold">Movie App</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <div className="relative" ref={dropdownRef}>
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

          <InputGroup className="w-[380px] rounded-xl bg-background">
            <InputGroupInput
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
        </div>

        <AnimatedThemeToggler className="rounded-full border border-border bg-card p-2 text-card-foreground hover:bg-accent" />
      </div>
    </header>
  );
};

export default Navbar;
