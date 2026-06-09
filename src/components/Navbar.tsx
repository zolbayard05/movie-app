"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
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
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0f0f0f]">
            <Image
              src="/logo.png"
              alt="ZMovie"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold">ZMovie</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <GenreMenu />
          <SearchBox />
        </div>

        <div className="flex items-center gap-2">
          <AnimatedThemeToggler className="rounded-full border border-border bg-card p-2 text-card-foreground hover:bg-accent" />

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
