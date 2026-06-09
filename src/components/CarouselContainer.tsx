import { Play, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Movie } from "@/lib/tmdb";

type CarouselContainerProps = {
  movies: Movie[];
};

export function CarouselContainer({ movies }: CarouselContainerProps) {
  const heroMovies = movies.slice(0, 5);

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {heroMovies.map((movie) => (
          <CarouselItem key={movie.id}>
            <div
              className="relative h-[440px] w-full bg-cover bg-center md:h-200"
              style={{ backgroundImage: `url(${movie.backdrop})` }}
            >
              <div className="absolute inset-0 bg-black/30" />

              <div className="relative z-10 flex h-full max-w-300 flex-col justify-center px-6 text-white md:px-24">
                <p className="text-lg">Now Playing:</p>

                <h1 className="text-3xl font-bold md:text-5xl">
                  {movie.title}
                </h1>

                <div className="mt-4 flex items-center gap-2">
                  <Star className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xl">{movie.rating.toFixed(1)}</span>
                </div>

                <p className="mt-6 max-w-90 text-sm leading-5">
                  {movie.overview}
                </p>

                <Link href={`/movie/${movie.id}`}>
                  <Button className="mt-6 w-fit bg-white text-black hover:bg-white/90">
                    <Play size={16} />
                    Watch Trailer
                  </Button>
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-4 md:left-10" />
      <CarouselNext className="right-4 md:right-10" />
    </Carousel>
  );
}
