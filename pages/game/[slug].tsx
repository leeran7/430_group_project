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
import { useUser } from "../../components/firebase";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { pick } from "lodash";
import clsx from "clsx";

const Home: NextPage<Props> = ({ game }) => {
  const [user] = useUser();
  const {
    loading,
    onAddCartItem,
    onWishlistDelete,
    onWishlistAdd,
    getIsInWishList,
    getIsOwned,
    getIsInCart,
  } = useUpdateUser();
  const { isFallback } = useRouter();

  if (isFallback || !game || loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <CgSpinner className="animate-spin" size="150px" />
      </div>
    );
  }
  const isInWishList = getIsInWishList(game.id);
  const isOwned = getIsOwned(game.id);
  const isInCart = getIsInCart(game.id);
  const price = getPricing(game.released, game.rating);
  return (
    <div className="relative">
      <Carousel
        autoPlay
        className="object-cover mt-3 ml-auto mr-auto h-1/2 w-5/6"
      >
        {[game.background_image, game.background_image_additional].map((i) => (
          <div key={i}>
            <img className="rounded-md" src={i} alt={game.name} />
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
              Price: <span className="semi-bold">{price}</span>
            </p>
            <p>
              Release Date: <span className="semi-bold">{game.released}</span>
            </p>
            {game.reddit_url && (
              <a
                href={game.reddit_url}
                className="text-2xl hover:text-indigo-600"
              >
                <FaReddit />
              </a>
            )}
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
          </div>
          {user && !isOwned && (
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  if (isInWishList) {
                    await onWishlistDelete(game.id);
                  } else {
                    await onWishlistAdd({
                      ...game,
                      price,
                    });
                  }
                }}
                className={clsx(
                  "mr-4 py-2 px-5 self-end text-center flex flex-col items-center justify-end z-10 rounded fill-red-600 border-2 border-transparent hover:border-red-600",
                  isInWishList && "border-red-600 hover:bg-red-100"
                )}
                type="button"
              >
                <svg
                  className="w-6 h-6 "
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <button
                onClick={async () => {
                  await onAddCartItem({
                    ...pick(game, [
                      "id",
                      "name",
                      "background_image",
                      "rating",
                      "released",
                      "slug",
                    ]),
                    price,
                  });
                }}
                className={clsx(
                  isInCart
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500",
                  "py-2 px-5 z-10 rounded"
                )}
              >
                Add to Cart
              </button>
            </div>
          )}
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
