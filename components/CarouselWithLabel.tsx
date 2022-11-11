import { Carousel } from "react-responsive-carousel";
import { Game } from "../types";

export const CarouselWithLabel: React.FC<{
  type: CarouselGameType;
  label: string;
}> = ({ type, label }) => {
  return (
    <span>
      <h2 className="text-center text-2xl">{label}</h2>
      <Carousel autoPlay>
        {type.map((g) => (
          <div key={g.slug}>
            <p className="legend">{g.name}</p>
            <img src={g.image_background} alt={g.name} />
          </div>
        ))}
      </Carousel>
    </span>
  );
};

type CarouselGameType = Game["genres"] | Game["tags"] | Game["developers"];
