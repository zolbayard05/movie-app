"use client";

import { FilmIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import GenreMenu from "@/components/GenreMenu";
import SearchBox from "@/components/SearchBox";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 text-foreground backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-primary p-2 text-primary-foreground">
            <FilmIcon size={20} />
          </div>
          <span className="text-xl font-bold">ZMovie</span>
        </Link>

        {/* Desktop цэс */}
        <div className="hidden items-center gap-4 md:flex">
          <GenreMenu />
          <SearchBox />
        </div>

        <div className="flex items-center gap-2">
          <AnimatedThemeToggler className="rounded-full border border-border bg-card p-2 text-card-foreground hover:bg-accent" />

          {/* Hamburger — зөвхөн mobile */}
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full border border-border bg-card p-2 text-card-foreground hover:bg-accent md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile цэс — нээгдэхэд search + genre гарна */}
      {open && (
        <div className="flex flex-col gap-4 border-t border-border px-6 py-4 md:hidden">
          <SearchBox />
          <GenreMenu />
        </div>
      )}
    </header>
  );
};

export default Navbar;
