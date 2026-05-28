"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Play, Star } from "lucide-react";

import MovieDetailSkeleton from "@/components/MovieDetailSkeleton";

const IMAGE = "https://image.tmdb.org/t/p/w500";
const BACKDROP = "https://image.tmdb.org/t/p/original";
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI4YTA3MzQ4ZGQ0YzI5NDM0ZDNjOTVmZTE4MDM1MCIsIm5iZiI6MTc3OTI3NDQyNS45OSwic3ViIjoiNmEwZDkyYjlmNGM0M2VmMTNjYjgxNWQ3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-P7ht59CToEV7YtGXVaI6zqc-VOe-Rwkn_x1uLA3n6I";

function formatRuntime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return dateStr.replace(/-/g, ".");
}

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
          { headers: { Authorization: TOKEN } },
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getMovie();
  }, [id]);

  if (loading) return <MovieDetailSkeleton />;

  if (!movie || movie.success === false) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl font-bold">
        Movie not found
      </div>
    );
  }

  const director = movie.credits?.crew?.find((p: any) => p.job === "Director");
  const writers: any[] = (movie.credits?.crew ?? [])
    .filter(
      (p: any) =>
        p.job === "Screenplay" || p.job === "Writer" || p.job === "Story",
    )
    .slice(0, 3);
  const stars: any[] = (movie.credits?.cast ?? []).slice(0, 3);
  const trailer = movie.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube",
  );
  const similarMovies = movie.similar?.results?.slice(0, 5) ?? [];

  const rating = movie.vote_average?.toFixed(1);
  const voteCount = movie.vote_count
    ? movie.vote_count >= 1000
      ? `${(movie.vote_count / 1000).toFixed(0)}k`
      : movie.vote_count
    : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Title */}
        <h1 className="mb-1 text-3xl font-bold">{movie.title}</h1>

        {/* Meta line */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          {movie.release_date && <span>{formatDate(movie.release_date)}</span>}
          {movie.adult === false && (
            <>
              <span>·</span>
              <span>PG</span>
            </>
          )}
          {movie.runtime > 0 && (
            <>
              <span>·</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </>
          )}
        </div>

        {/* Poster + Backdrop + Rating */}
        <div className="mb-6 flex gap-4">
          {/* Poster */}
          <div className="shrink-0">
            <img
              src={`${IMAGE}${movie.poster_path}`}
              alt={movie.title}
              className="h-[220px] w-[150px] rounded-xl object-cover"
            />
          </div>

          {/* Backdrop + trailer button */}
          <div className="relative flex-1 overflow-hidden rounded-xl">
            <img
              src={`${BACKDROP}${movie.backdrop_path}`}
              alt={movie.title}
              className="h-[220px] w-full object-cover"
            />
            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm hover:bg-black/80 transition"
              >
                <Play size={14} className="fill-white" />
                Play trailer · {trailer.name?.match(/\d+:\d+/)?.[0] ?? "2:00"}
              </a>
            )}
          </div>

          {/* Rating box */}
          <div className="flex shrink-0 flex-col items-center justify-start gap-1 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Rating
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold leading-none">{rating}</span>
              <span className="text-sm text-muted-foreground">/10</span>
            </div>
            {voteCount && (
              <span className="text-xs text-muted-foreground">{voteCount}</span>
            )}
          </div>
        </div>

        {/* Genre tags */}
        {movie.genres?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {movie.genres.map((g: any) => (
              <span
                key={g.id}
                className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-foreground"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        {movie.overview && (
          <p className="mb-6 text-sm leading-6 text-muted-foreground">
            {movie.overview}
          </p>
        )}

        {/* Director / Writers / Stars */}
        <div className="space-y-0 divide-y divide-border border-t border-border">
          {director && (
            <div className="flex gap-4 py-3 text-sm">
              <span className="w-20 shrink-0 font-semibold">Director</span>
              <span className="text-muted-foreground">{director.name}</span>
            </div>
          )}
          {writers.length > 0 && (
            <div className="flex gap-4 py-3 text-sm">
              <span className="w-20 shrink-0 font-semibold">Writers</span>
              <span className="text-muted-foreground">
                {writers.map((w, i) => (
                  <span key={w.id}>
                    {w.name}
                    {i < writers.length - 1 && (
                      <span className="mx-1 text-border">·</span>
                    )}
                  </span>
                ))}
              </span>
            </div>
          )}
          {stars.length > 0 && (
            <div className="flex gap-4 py-3 text-sm">
              <span className="w-20 shrink-0 font-semibold">Stars</span>
              <span className="text-muted-foreground">
                {stars.map((s, i) => (
                  <span key={s.id}>
                    {s.name}
                    {i < stars.length - 1 && (
                      <span className="mx-1 text-border">·</span>
                    )}
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>

        {/* More like this */}
        {similarMovies.length > 0 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">More like this</h2>
              <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                See more →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {similarMovies.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/movie/${item.id}`}
                  className="group"
                >
                  <img
                    src={`${IMAGE}${item.poster_path}`}
                    alt={item.title}
                    className="mb-2 h-[200px] w-full rounded-xl object-cover transition group-hover:opacity-80"
                  />
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{item.vote_average?.toFixed(1)}/10</span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm">{item.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
