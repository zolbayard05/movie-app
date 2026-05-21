import { Star } from "lucide-react";

type MovieCardProps = {
  image: string;
  title: string;
  rating: number;
};

export default function MovieCard({ image, title, rating }: MovieCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-[#f4f4f4]">
      {image && (
        <img
          src={image}
          alt={title}
          className="h-[450px] w-full object-cover"
        />
      )}

      <div className="p-3">
        <div className="mb-2 flex items-center gap-1">
          <Star size={16} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{rating.toFixed(1)}/10</span>
        </div>

        <h3 className="text-lg font-medium leading-6">{title}</h3>
      </div>
    </div>
  );
}
