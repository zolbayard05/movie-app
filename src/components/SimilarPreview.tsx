"use client";

import axios from "axios";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AUTH, MODERN_FROM, POSTER, type TmdbMovie } from "@/lib/tmdb";

type Props = {
  movieId: string;
  genreIds: number[];
};

type Item = {
  id: number;
  title: string;
  poster: string;
  rating: number;
};

export default function SimilarPreview({ movieId, genreIds }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(false);

  // массивын оронд тогтвортой string ашиглана (deps-д зориулж)
  const genreKey = genreIds.slice(0, 3).join(",");

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const withGenres = genreKey ? `&with_genres=${genreKey}` : "";
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&primary_release_date.gte=${MODERN_FROM}&page=1${withGenres}`,
          { headers: AUTH },
        );

        // постертой + энэ кино биш
        const filtered = response.data.results.filter(
          (m: TmdbMovie) => m.poster_path && String(m.id) !== movieId,
        );

        setItems(
          filtered.slice(0, 5).map((m: TmdbMovie) => ({
            id: m.id,
            title: m.title,
            poster: `${POSTER}${m.poster_path}`,
            rating: m.vote_average,
          })),
        );
        setHasMore(filtered.length > 5);
      } catch (error) {
        console.error("Failed to fetch similar:", error);
      }
    };

    fetchSimilar();
  }, [movieId, genreKey]);

  if (items.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">More like this</h2>
        {hasMore && (
          <Link
            href={`/similar?movie=${movieId}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            See more →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <Link key={item.id} href={`/movie/${item.id}`}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-[300px] w-full">
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{item.rating?.toFixed(1)}/10</span>
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
  );
}
