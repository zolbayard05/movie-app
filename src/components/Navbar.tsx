"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { FilmIcon, SearchIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 text-foreground backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary p-2 text-primary-foreground">
            <FilmIcon size={20} />
          </div>

          <span className="text-xl font-bold">Movie App</span>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <Button variant="outline" className="rounded-xl">
            <ChevronDown size={16} />
            Genre
          </Button>

          <InputGroup className="w-[380px] rounded-xl bg-background">
            <InputGroupInput placeholder="Search..." />

            <InputGroupAddon align="inline-start">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <AnimatedThemeToggler className="rounded-full border border-border bg-card p-2 text-card-foreground hover:bg-accent" />
      </div>
    </header>
  );
};

export default Navbar;
