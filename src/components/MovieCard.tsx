import { Star } from "lucide-react";
import Image from "next/image";

type MovieCardProps = {
  image: string;
  rating: number | string;
  title: string;
};
let MovieCard = ({ rating, title, image }: MovieCardProps) => {
  return (
    <div className="flex flex-col w-fit h-[439px]">
      <Image src={image} alt="movie-card" width={230} height={340}></Image>
      <div className="flex flex-col p-2 bg-[#F4F4F5] h-[80px] w-[230px]">
        <div className="flex gap-1">
          <Star fill="yellow" color="yellow" />
          <p>
            <span>{rating}</span>/10
          </p>
        </div>
        <h3 className="text-[#09090B] text-[16px] w-[230px]">{title}</h3>
      </div>
    </div>
  );
};
export default MovieCard;
