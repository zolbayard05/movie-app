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
    <div className="flex justify-around h-20 items-center">
      <div className="flex gap-3">
        <FilmIcon />
        Movie App
      </div>
      <div className="flex gap-5">
        <Button className="rounded-[10px] w-25 bg-white text-black border border-solid border-2px">
          <ChevronDown /> Genre
        </Button>

        <InputGroup className="rounded-[10px] w-[380px]">
          <InputGroupInput id="inline-start-input" placeholder="Search..." />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <AnimatedThemeToggler />
    </div>
  );
};
export default Navbar;
