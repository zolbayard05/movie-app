import MovieCard from "@/components/MovieCard";
import { CarouselContainer } from "@/components/Carousel";

let Home = () => {
  return (
    <div>
      <MovieCard
        image="/dragon.jpg"
        title="How To Train Your Dragon"
        rating={6.9}
      />
      <CarouselContainer />
    </div>
  );
};
export default Home;
