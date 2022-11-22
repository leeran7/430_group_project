import { User } from "../types";
import { Props } from "../pages";
import { useState } from "react";
import { getPricing } from "./lib";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { RawgApiClient } from "./rawgApiClient";
import Link from "next/link";
import { FaCartPlus } from "react-icons/fa";
import clsx from "clsx";
import pick from "lodash/pick";

export const GameCard: React.FC<{
  game: Props["games"][0] | User["wishlist"][0];
  userExists: boolean;
}> = ({ game, userExists }) => {
  const [trailer, setTrailer] = useState<undefined | string>(undefined);
  const [searched, setSearched] = useState(false);
  const [hovering, setHovering] = useState(false);
  const { getIsInWishList, onWishlistAdd, onAddCartItem, onWishlistDelete } =
    useUpdateUser();
  const isInWishList = getIsInWishList(game.id);
  const price = getPricing(game.released, game.rating);
  return (
    <span
      className="relative flex flex-col z-30 shadow-md rounded-lg focus:shadow-md hover:md:shadow-2xl shadow-gray-300 hover:sm:scale-110 transition-all ease-in-out"
      onMouseOver={async () => {
        setHovering(true);
        if (!trailer && !searched) {
          const rawgApiClient = new RawgApiClient();
          const trailer = await rawgApiClient.getTrailer(game.slug);
          if (trailer.results[0]) {
            if (trailer.results[0]?.data?.max) {
              setTrailer(trailer.results[0].data.max);
            }
          } else {
            setSearched(true);
          }
        }
      }}
      onMouseLeave={() => setHovering(false)}
    >
      <Link href={`/game/${game.id}`}>
        <a className="group flex flex-col gap-y-1 p-2">
          <div className="flex flex-col overflow-hidden rounded-lg bg-gray-200">
            {trailer && hovering ? (
              <video controls muted autoPlay src={trailer} />
            ) : (
              <img
                src={game.background_image}
                alt={game.name}
                className="h-52 sm:h-40"
              />
            )}
          </div>
          <div className={clsx(trailer && hovering && "pt-4")}>
            <h3 className="text-gray-700 font-semibold">{game.name}</h3>
            <p className="text-gray-800">Price: {price}</p>
            <p className="flex text-xs gap-x-1">Rating: {game.rating} / 5</p>
          </div>
        </a>
      </Link>
      {userExists && (
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
              "mr-4 self-end mb-2 text-center flex flex-col items-center justify-end py-1 z-10 rounded fill-red-600 border-2 border-transparent hover:border-red-600 px-4",
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
                ...pick(game, ["id", "name", "background_image"]),
                price,
              });
            }}
            className={clsx(
              "w-16 mr-2 self-end mb-2 text-center flex flex-col items-center justify-end py-2.5 z-10 bg-green-400 hover:bg-green-500 rounded"
            )}
          >
            <FaCartPlus />
          </button>
        </div>
      )}
    </span>
  );
};
