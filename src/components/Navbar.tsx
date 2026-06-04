"use client";

import { FilmIcon } from "lucide-react";
import Link from "next/link";
import GenreMenu from "@/components/GenreMenu";
import SearchBox from "@/components/SearchBox";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const Navbar = () => {
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
          <GenreMenu />
          <SearchBox />
        </div>

        <AnimatedThemeToggler className="rounded-full border border-border bg-card p-2 text-card-foreground hover:bg-accent" />
      </div>
    </header>
  );
};

export default Navbar;
