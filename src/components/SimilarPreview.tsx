import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { POSTER, type SimilarMovie } from "@/lib/tmdb";

type Props = {
  movieId: string;
  similar: SimilarMovie[];
};

export default function SimilarPreview({ movieId, similar }: Props) {
  const withPoster = similar.filter((m) => m.poster_path);
  const preview = withPoster.slice(0, 5);

  if (preview.length === 0) return null;

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">More like this</h2>
        {withPoster.length > 5 && (
          <Link
            href={`/similar?movie=${movieId}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            See more →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {preview.map((item) => (
          <Link key={item.id} href={`/movie/${item.id}`}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-[300px] w-full">
                <Image
                  src={`${POSTER}${item.poster_path}`}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
              </div>
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
  );
}
