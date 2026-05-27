"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Clock, Play, Star } from "lucide-react";

import MovieDetailSkeleton from "@/components/MovieDetailSkeleton";

const IMAGE = "https://image.tmdb.org/t/p/w500";
const BACKDROP = "https://image.tmdb.org/t/p/original";

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits,videos,similar`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI4YTA3MzQ4ZGQ0YzI5NDM0ZDNjOTVmZTE4MDM1MCIsIm5iZiI6MTc3OTI3NDQyNS45OSwic3ViIjoiNmEwZDkyYjlmNGM0M2VmMTNjYjgxNWQ3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-P7ht59CToEV7YtGXVaI6zqc-VOe-Rwkn_x1uLA3n6I`,
            },
          },
        );

        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getMovie();
    }
  }, [id]);

  if (loading) {
    return <MovieDetailSkeleton />;
  }

  if (!movie || movie.success === false) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl font-bold">
        Movie not found
      </div>
    );
  }

  const director = movie.credits?.crew?.find(
    (person: any) => person.job === "Director",
  );

  const trailer = movie.videos?.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube",
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section
        className="relative min-h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,.9), rgba(0,0,0,.4)), url(${BACKDROP}${movie.backdrop_path})`,
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row">
          <img
            src={`${IMAGE}${movie.poster_path}`}
            alt={movie.title}
            className="w-[300px] rounded-2xl shadow-2xl"
          />

          <div className="max-w-3xl text-white">
            <h1 className="mb-4 text-5xl font-bold">{movie.title}</h1>

            {movie.tagline && (
              <p className="mb-4 italic text-gray-300">{movie.tagline}</p>
            )}

            <div className="mb-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {movie.vote_average?.toFixed(1)}
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {movie.release_date}
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {movie.runtime} min
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {movie.genres?.map((genre: any) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-white/20 px-4 py-2 text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="mb-6 leading-7">{movie.overview}</p>

            <p>
              <b>Director:</b> {director?.name || "Unknown"}
            </p>

            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3"
              >
                <Play size={18} />
                Watch Trailer
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold">More Like This</h2>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {movie.similar?.results?.slice(0, 10).map((item: any) => (
            <Link key={item.id} href={`/movie/${item.id}`}>
              <img
                src={`${IMAGE}${item.poster_path}`}
                alt={item.title}
                className="rounded-xl"
              />

              <p className="mt-2 line-clamp-2">{item.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
