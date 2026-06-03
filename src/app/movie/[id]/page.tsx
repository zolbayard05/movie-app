"use client";

import { Play, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import MovieDetailSkeleton from "@/components/MovieDetailSkeleton";
import Navbar from "@/components/Navbar";

const IMAGE = "https://image.tmdb.org/t/p/w500";
const BACKDROP = "https://image.tmdb.org/t/p/original";
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOWI4YTA3MzQ4ZGQ0YzI5NDM0ZDNjOTVmZTE4MDM1MCIsIm5iZiI6MTc3OTI3NDQyNS45OSwic3ViIjoiNmEwZDkyYjlmNGM0M2VmMTNjYjgxNWQ3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-P7ht59CToEV7YtGXVaI6zqc-VOe-Rwkn_x1uLA3n6I";

interface CrewMember {
  id: number;
  name: string;
  job: string;
}
interface CastMember {
  id: number;
  name: string;
}
interface VideoItem {
  key: string;
  type: string;
  site: string;
  name: string;
}
interface Genre {
  id: number;
  name: string;
}
interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

interface MovieDetail {
  title: string;
  release_date?: string;
  adult?: boolean;
  runtime?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  genres?: Genre[];
  overview?: string;
  credits?: { crew: CrewMember[]; cast: CastMember[] };
  similar?: { results: SimilarMovie[] };
  success?: boolean;
}

interface VideoResponse {
  results: VideoItem[];
}

function formatRuntime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatDate(dateStr: string) {
  return dateStr.replace(/-/g, ".");
}

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [trailer, setTrailer] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Movie detail + videos хоёуланг зэрэг fetch хийх
        const [movieRes, videoRes] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits,similar`,
            { headers: { Authorization: TOKEN } },
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
            { headers: { Authorization: TOKEN } },
          ),
        ]);

        const movieData = (await movieRes.json()) as MovieDetail;
        const videoData = (await videoRes.json()) as VideoResponse;

        setMovie(movieData);

        // Trailer эхлээд, байхгүй бол Teaser авах
        const found =
          videoData.results?.find(
            (v) => v.type === "Trailer" && v.site === "YouTube",
          ) ??
          videoData.results?.find(
            (v) => v.type === "Teaser" && v.site === "YouTube",
          ) ??
          null;
        setTrailer(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Escape дарахад player хаах
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPlayer(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  if (loading) return <MovieDetailSkeleton />;

  if (!movie || movie.success === false) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl font-bold">
        Movie not found
      </div>
    );
  }

  const director = movie.credits?.crew?.find((p) => p.job === "Director");
  const writers = (movie.credits?.crew ?? [])
    .filter(
      (p) => p.job === "Screenplay" || p.job === "Writer" || p.job === "Story",
    )
    .slice(0, 3);
  const stars = (movie.credits?.cast ?? []).slice(0, 3);
  const similarMovies = (movie.similar?.results ?? [])
    .filter((m) => m.poster_path)
    .slice(0, 5);
  const rating = movie.vote_average?.toFixed(1) ?? "N/A";
  const vc = movie.vote_count ?? 0;
  const voteCount =
    vc > 0 ? (vc >= 1000 ? `${(vc / 1000).toFixed(0)}k` : String(vc)) : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      {/* ── ReactPlayer Modal ── */}
      {showPlayer && trailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={() => setShowPlayer(false)}
          onKeyDown={(e) => e.key === "Enter" && setShowPlayer(false)}
        >
          <div
            className="relative w-full max-w-5xl px-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPlayer(false)}
              className="absolute -top-10 right-4 rounded-full p-1 text-white hover:text-gray-300"
            >
              <X size={28} />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-2xl">
              <ReactPlayer
                src={`https://www.youtube.com/watch?v=${trailer.key}`}
                width="100%"
                height="100%"
                playing
                controls
              />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Title + Rating */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              {movie.release_date && (
                <span>{formatDate(movie.release_date)}</span>
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
        <div className="mb-5 flex gap-3">
          <div className="shrink-0">
            <Image
              src={`${IMAGE}${movie.poster_path}`}
              alt={movie.title ?? ""}
              width={340}
              height={430}
              className="rounded-xl object-cover"
              style={{ width: "340px", height: "430px" }}
            />
          </div>

          <div className="relative flex-1 overflow-hidden rounded-xl">
            <Image
              src={`${BACKDROP}${movie.backdrop_path}`}
              alt={movie.title ?? ""}
              width={1920}
              height={430}
              className="object-cover"
              style={{ width: "100%", height: "430px" }}
            />
            <div className="absolute inset-0 bg-black/10" />

            {trailer && (
              <button
                type="button"
                onClick={() => setShowPlayer(true)}
                className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/55 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/75"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                  <Play size={12} className="ml-0.5 fill-black text-black" />
                </div>
                Play trailer · {trailer.name?.match(/\d+:\d+/)?.[0] ?? "2:35"}
              </button>
            )}
          </div>
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g.id}
                className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
              >
                {g.name}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        {movie.overview && (
          <p className="mb-5 text-sm leading-6 text-muted-foreground">
            {movie.overview}
          </p>
        )}

        {/* Director / Writers / Stars */}
        <div className="divide-y divide-border border-t border-border">
          {director && (
            <div className="flex gap-6 py-3 text-sm">
              <span className="w-20 shrink-0 font-semibold text-foreground">
                Director
              </span>
              <span className="text-muted-foreground">{director.name}</span>
            </div>
          )}
          {writers.length > 0 && (
            <div className="flex gap-6 py-3 text-sm">
              <span className="w-20 shrink-0 font-semibold text-foreground">
                Writers
              </span>
              <span className="text-muted-foreground">
                {writers.map((w, i) => (
                  <span key={w.id}>
                    {w.name}
                    {i < writers.length - 1 && (
                      <span className="mx-1 opacity-40">·</span>
                    )}
                  </span>
                ))}
              </span>
            </div>
          )}
          {stars.length > 0 && (
            <div className="flex gap-6 py-3 text-sm">
              <span className="w-20 shrink-0 font-semibold text-foreground">
                Stars
              </span>
              <span className="text-muted-foreground">
                {stars.map((s, i) => (
                  <span key={s.id}>
                    {s.name}
                    {i < stars.length - 1 && (
                      <span className="mx-1 opacity-40">·</span>
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
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                See more →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {similarMovies.map((item) => (
                <Link key={item.id} href={`/movie/${item.id}`}>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <Image
                      src={`${IMAGE}${item.poster_path}`}
                      alt={item.title}
                      width={500}
                      height={300}
                      className="object-cover"
                      style={{ width: "100%", height: "300px" }}
                    />
                    <div className="space-y-2 p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.vote_average?.toFixed(1)}/10</span>
                      </div>
                      <h3 className="line-clamp-2 min-h-12 font-semibold text-card-foreground">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
