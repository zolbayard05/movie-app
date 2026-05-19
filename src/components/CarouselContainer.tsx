"use client";

import { Play, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { heroMovies } from "@/components/MovieData";

export function CarouselContainer() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {heroMovies.map((movie, index) => (
          <CarouselItem key={index}>
            <section className="relative h-[560px] overflow-hidden">
              <img
                src={movie.image}
                alt={movie.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/35" />

              <div className="relative z-10 flex h-full items-center px-10 md:px-24">
                <div className="max-w-[360px] text-white">
                  <p className="mb-1 text-base">Now Playing:</p>

                  <h1 className="mb-2 text-4xl font-bold">{movie.title}</h1>

                  <div className="mb-8 flex items-center gap-2">
                    <Star className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">
                      {movie.rating}
                    </span>
                  </div>

                  <p className="mb-6 text-sm leading-5">{movie.description}</p>

                  <button className="flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm text-black">
                    <Play size={16} />
                    Watch Trailer
                  </button>
                </div>
              </div>
            </section>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-10" />
      <CarouselNext className="right-10" />
    </Carousel>
  );
}
