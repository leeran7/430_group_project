import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import {
  FaPlaystation,
  FaXbox,
  FaDesktop,
  FaLinux,
  FaReddit,
} from "react-icons/fa";
import { RawgApiClient, Game } from "../../components/rawgApiClient";
import { useRouter } from "next/router";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Home: NextPage<Props> = ({ game }) => {
  const router = useRouter();
  if (router.isFallback) return <div>loading...</div>;

  return (
    <div className="relative">
      <Carousel className="object-cover h-1/2 w-full">
        <div>
          <img src={game.background_image} alt="background image" />
          <p className="legend">{game.name}</p>
        </div>
        <div>
          <img
            src={game.background_image_additional}
            alt="background image alternate"
          />
          <p className="legend">{game.name}</p>
        </div>
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

            <p>Rating: {game.rating}</p>
            <div className="flex gap-x-3">
              {game.ratings.map((r) => (
                <div key={r.id} className="capitalize">
                  {r.title} - {r.count.toLocaleString()} - {r.percent}%,{" "}
                </div>
              ))}
            </div>
            <p>ESRB Rating: {game.esrb_rating.name}</p>
            <span className="flex gap-x-3">
              {game.platforms
                .map((platform) => platform.platform.name)
                .map(getSymbols)}
            </span>

            <a
              href={game.reddit_url}
              className="text-2xl hover:text-indigo-600"
            >
              <FaReddit />
            </a>
          </div>
        </div>
        <span>
          <h2 className="text-center text-2xl">Developers</h2>
          <Carousel>
            {game.developers.map((d) => (
              <div key={d.slug}>
                <p className="legend">{d.name}</p>
                <img
                  src={d.image_background}
                  alt="developers background image"
                />
              </div>
            ))}
          </Carousel>
        </span>
        <span>
          <h2 className="text-center text-2xl">Tags</h2>
          <Carousel>
            {game.tags.map((t) => (
              <div key={t.slug}>
                <p className="legend">{t.name}</p>
                <img src={t.image_background} alt={t.name} />
              </div>
            ))}
          </Carousel>
        </span>
        <span>
          <h2 className="text-center text-2xl">Genres</h2>
          <Carousel>
            {game.genres.map((g) => (
              <div key={g.slug}>
                <p className="legend">{g.name}</p>
                <img src={g.image_background} alt={g.name} />
              </div>
            ))}
          </Carousel>
        </span>
      </div>
    </div>
  );
};

export const getSymbols = (platform: string) => {
  let symb = null;
  if (platform.includes("PlayStation")) {
    symb = <FaPlaystation />;
  } else if (platform.includes("Xbox")) {
    symb = <FaXbox />;
  } else if (platform.includes("PC")) {
    symb = <FaDesktop />;
  } else if (platform.includes("Linux")) {
    symb = <FaLinux />;
  }
  const number = platform.match(/\d+/g);
  return (
    <p key={platform} className="flex text-lg items-center justify-center">
      {symb}
      <sup>{platform.includes("One") ? 1 : number}</sup>
    </p>
  );
};
type Props = {
  game: Game;
};

export const getPricing = (releaseDate: string, rating: number) => {
  let price = null;
  if (releaseDate.includes("2022")) {
    price = "$69.99";
  } else if (rating >= 4) {
    price = "$59.99";
  } else if (rating >= 3) {
    price = "$49.99";
  } else if (rating >= 2) {
    price = "$39.99";
  } else if (rating >= 1) {
    price = "$29.99";
  } else {
    price = "$19.99";
  }
  return price;
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
