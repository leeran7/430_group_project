import { CarouselWithLabel } from "../../components/CarouselWithLabel";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { FaReddit } from "react-icons/fa";
import { RawgApiClient } from "../../components/rawgApiClient";
import { Game } from "../../types";
import { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { getPricing, getSymbols } from "../../components/lib";
import { CgSpinner } from "react-icons/cg";
const Home: NextPage<Props> = ({ game }) => {
  const { isFallback } = useRouter();
  if (isFallback || !game) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
        <CgSpinner className="animate-spin" size="98px" />
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel autoPlay className="object-cover h-1/2 w-full">
        {[game.background_image, game.background_image_additional].map((i) => (
          <div key={i}>
            <img src={i} alt={game.name} />
            <p className="legend">{game.name}</p>
          </div>
        ))}
      </Carousel>

      <div className="grid grid-cols-3 absolute gap-x-5 mx-20">
        <div className="col-span-3 px-20 py-10 bg-white z-10">
          <div className="flex flex-col gap-y-1">
            <h1 className="text-6xl font-semibold">
              <a href={game.website} className="hover:text-indigo-600">
                {game.name}
              </a>
            </h1>
            <p className="tracking-wider">{game.description_raw}</p>
            <p>
              Price:{" "}
              <span className="semi-bold">
                {getPricing(game.released, game.rating)}
              </span>
            </p>
            <p>
              Release Date: <span className="semi-bold">{game.released}</span>
            </p>

            {game.rating && <p>Rating: {game.rating}</p>}
            <div className="flex gap-x-3">
              {game.ratings.map((r) => (
                <div key={r.id} className="capitalize">
                  {r.title} - {r.count.toLocaleString()} - {r.percent}%,{" "}
                </div>
              ))}
            </div>
            {game.esrb_rating?.name ? (
              <p>ESRB Rating: {game.esrb_rating.name}</p>
            ) : null}
            <span className="flex gap-x-3">
              {game.platforms
                .map((platform) => platform.platform.name)
                .map(getSymbols)}
            </span>
            {game.reddit_url && (
              <a
                href={game.reddit_url}
                className="text-2xl hover:text-indigo-600"
              >
                <FaReddit />
              </a>
            )}
          </div>
        </div>
        <CarouselWithLabel type={game.developers} label="Developers" />
        <CarouselWithLabel type={game.tags} label="Tags" />
        <CarouselWithLabel type={game.genres} label="Genres" />
      </div>
    </div>
  );
};

export type Props = {
  game: Game;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (typeof params?.slug !== "string") {
    return {
      notFound: true,
    };
  }
  const rawgApiClient = new RawgApiClient();
  const game = await rawgApiClient.getGame(params.slug);
  if (!game) {
    return {
      notFound: true,
    };
  }

  return {
    props: { game },
  };
};

export default Home;
