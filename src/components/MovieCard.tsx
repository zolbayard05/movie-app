import Link from "next/link";
import { Star } from "lucide-react";

type MovieCardProps = {
  id: number;
  image: string;
  title: string;
  rating: number;
};

export default function MovieCard({
  id,
  image,
  title,
  rating,
}: MovieCardProps) {
  return (
    <Link href={`/movie/${id}`}>
      <div className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        {image && (
          <img
            src={image}
            alt={title}
            className="h-[300px] w-full object-cover"
          />
        )}

        <div className="space-y-2 p-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}/10</span>
          </div>

          <h3 className="line-clamp-2 min-h-12 font-semibold text-card-foreground">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
