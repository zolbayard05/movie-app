import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Play, Star } from "lucide-react";
import type { Movie } from "@/app/page";

type CarouselContainerProps = {
  movies: Movie[];
};

export function CarouselContainer({ movies }: CarouselContainerProps) {
  const heroMovies = movies.slice(0, 5);

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {heroMovies.map((movie, index) => (
          <CarouselItem key={index}>
            <div
              className="relative h-200 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.backdrop})` }}
            >
              <div className="absolute inset-0 bg-black/30" />

              <div className="relative z-10 flex h-full max-w-300 flex-col justify-center px-10 text-white md:px-24">
                <p className="text-lg">Now Playing:</p>

                <h1 className="text-5xl font-bold">{movie.title}</h1>

                <div className="mt-4 flex items-center gap-2">
                  <Star className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xl">{movie.rating.toFixed(1)}</span>
                </div>

                <p className="mt-6 max-w-90 text-sm leading-5">
                  {movie.overview}
                </p>

                <Button className="mt-6 w-fit bg-white text-black hover:bg-white/90">
                  <Play size={16} />
                  Watch Trailer
                </Button>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-10" />
      <CarouselNext className="right-10" />
    </Carousel>
  );
}
