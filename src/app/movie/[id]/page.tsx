"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import MovieCredits from "@/components/MovieCredits";
import MovieDetailSkeleton from "@/components/MovieDetailSkeleton";
import MovieHero from "@/components/MovieHero";
import Navbar from "@/components/Navbar";
import SimilarPreview from "@/components/SimilarPreview";
import { AUTH, type MovieDetail } from "@/lib/tmdb";

export default function MovieDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits,videos,similar`,
          { headers: AUTH },
        );
        setMovie((await response.json()) as MovieDetail);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) getMovie();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <MovieDetailSkeleton />
        <Footer />
      </main>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center text-2xl font-bold">
          Movie not found
        </div>
        <Footer />
      </main>
    );
  }

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube",
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <MovieHero movie={movie} trailer={trailer} />

        {/* Genre tags */}
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

        <MovieCredits credits={movie.credits} />

        <SimilarPreview movieId={id} similar={movie.similar?.results ?? []} />
      </div>

      <Footer />
    </main>
  );
}
