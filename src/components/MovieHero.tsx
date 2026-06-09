"use client";

import { Play, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import TrailerDialog from "@/components/TrailerDialog";
import { BACKDROP, type MovieDetail, POSTER, type VideoItem } from "@/lib/tmdb";

function formatRuntime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

type Props = {
  movie: MovieDetail;
  trailer?: VideoItem;
};

export default function MovieHero({ movie, trailer }: Props) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const rating = movie.vote_average?.toFixed(1) ?? "N/A";
  const vc = movie.vote_count ?? 0;
  const voteCount =
    vc > 0 ? (vc >= 1000 ? `${(vc / 1000).toFixed(0)}k` : String(vc)) : null;

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{movie.title}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            {movie.release_date && (
              <span>{movie.release_date.replace(/-/g, ".")}</span>
            )}
            {movie.adult === false && (
              <>
                <span>·</span>
                <span>PG</span>
              </>
            )}
            {movie.runtime && movie.runtime > 0 && (
              <>
                <span>·</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-0.5">
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

      {/* Poster + Backdrop */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-xl md:aspect-auto md:h-[430px] md:w-[340px]">
          <Image
            src={`${POSTER}${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            className="object-cover"
          />
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-xl md:aspect-auto md:h-[430px] md:flex-1">
          <Image
            src={`${BACKDROP}${movie.backdrop_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />

          {trailer && (
            <button
              type="button"
              onClick={() => setTrailerOpen(true)}
              className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/75"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                <Play size={12} className="fill-black text-black ml-0.5" />
              </div>
              Play trailer · {trailer.name?.match(/\d+:\d+/)?.[0] ?? "2:35"}
            </button>
          )}
        </div>
      </div>

      {trailer && (
        <TrailerDialog
          videoKey={trailer.key}
          open={trailerOpen}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </>
  );
}
