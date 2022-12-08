import type { NextPage } from "next";
import { PropsWithChildren, useState } from "react";
import { Game, User } from "../types";
import { getPricing } from "../components/lib";
import { RawgApiClient } from "../components/rawgApiClient";
import { useUser } from "../components/firebase";
import { CgSpinner } from "react-icons/cg";
import { useGetGames } from "../hooks/useGetGames";
import { useUpdateUser } from "../hooks/useUpdateUser";
import pick from "lodash/pick";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import { FaCartPlus, FaStarHalf } from "react-icons/fa";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Button } from "../components/PageButton";

const Home: NextPage = () => {
  const [user] = useUser();
  const { games, popularGames, recentGames, loading, query } = useGetGames();
  const pageOneOrNoQuery = query.page === "1" || !query.page;
  if (loading) {
    return (
      <div className="flex flex-col">
        <PageButtons pageOneOrNoQuery={pageOneOrNoQuery} />
        <CgSpinner className="animate-spin m-auto" size="150px" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageButtons pageOneOrNoQuery={pageOneOrNoQuery} />
      {pageOneOrNoQuery ? (
        <div className="flex flex-col">
          <GameContainer label="Popular Games">
            {popularGames.length > 0
              ? popularGames?.map((game) => (
                  <GameCard key={game.id} game={game} userExists={!!user} />
                ))
              : null}
          </GameContainer>
          <GameContainer label="Recent Games">
            {recentGames.length > 0
              ? recentGames?.map((game) => (
                  <GameCard key={game.id} game={game} userExists={!!user} />
                ))
              : null}
          </GameContainer>
        </div>
      ) : (
        <GameContainer label="All Games">
          {games.length > 0
            ? games?.map((game) => (
                <GameCard key={game.id} game={game} userExists={!!user} />
              ))
            : null}
        </GameContainer>
      )}

      <PageButtons pageOneOrNoQuery={pageOneOrNoQuery} />
    </div>
  );
};

export const GameCard: React.FC<{
  game: Props["games"][0] | User["wishlist"][0];
  userExists: boolean;
}> = ({ game, userExists }) => {
  const [trailer, setTrailer] = useState<undefined | string>(undefined);
  const [searched, setSearched] = useState(false);
  const [playTrailer, setPlayTrailer] = useState(false);
  const {
    getIsInWishList,
    onWishlistAdd,
    onAddCartItem,
    onWishlistDelete,
    getIsInCart,
    getIsOwned,
  } = useUpdateUser();

  const isInWishList = getIsInWishList(game.id);
  const isInCart = getIsInCart(game.id);
  const isOwned = getIsOwned(game.id);

  const { pathname, reload } = useRouter();
  const price = getPricing(game.released, game.rating);
  return (
    <span
      className="relative flex flex-col justify-between hover:z-30 shadow-md rounded-lg bg-white focus:shadow-md hover:sm:scale-125 hover:shadow-2xl shadow-gray-300 transition-all ease-out duration-[250] border"
      onMouseOver={async () => {
        if (trailer && !playTrailer) {
          setPlayTrailer(true);
        } else if (!trailer && !searched) {
          const rawgApiClient = new RawgApiClient();
          const trailer = await rawgApiClient.getTrailer(game.slug);
          if (trailer.results[0]) {
            if (trailer.results[0]?.data?.max) {
              setTrailer(trailer.results[0].data.max);
              setPlayTrailer(true);
            }
          } else {
            setSearched(true);
          }
        }
      }}
    >
      <Link href={`/game/${game.id}`}>
        <a className="group flex flex-col gap-y-1">
          <div className="flex flex-col overflow-hidden rounded-t-lg bg-gray-200">
            {trailer && playTrailer ? (
              <video
                controls
                muted
                autoPlay
                src={trailer}
                onEnded={() => setPlayTrailer(false)}
                className="h-52 sm:h-40"
              />
            ) : (
              <img
                loading="eager"
                src={game.background_image}
                alt={game.name}
                className="h-52 sm:h-40"
              />
            )}
          </div>

          <div className={clsx("flex-grow px-2", !userExists && "pb-2")}>
            <h3 className="text-gray-700 truncate font-semibold">
              {game.name}
            </h3>
            {pathname !== "/account" && (
              <>
                <p className="text-gray-800">Price: {price}</p>

                <p className="flex text-xs gap-x-1">
                  {new Array(Math.floor(game.rating)).fill(0).map((_, i) => (
                    <AiFillStar key={i} />
                  ))}
                  {(Math.round(game.rating * 2) / 2) % 1 === 0.5 ||
                  game.rating === 0 ? (
                    <FaStarHalf />
                  ) : null}
                </p>
              </>
            )}
          </div>
        </a>
      </Link>
      {userExists && pathname !== "/account" && !isOwned && (
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
              reload();
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
              reload();
            }}
            className={clsx(
              isInCart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-400 hover:bg-green-500",
              "w-16 mr-2 self-end mb-2 text-center flex flex-col items-center justify-end py-2.5 z-10  rounded"
            )}
          >
            <FaCartPlus />
          </button>
        </div>
      )}
    </span>
  );
};

const PageButtons: React.FC<{ pageOneOrNoQuery: boolean }> = ({
  pageOneOrNoQuery,
}) => {
  const { query } = useRouter();
  return (
    <div
      className={clsx(
        "flex gap-x-10 items-center justify-center text-center py-10 w-full",
        query.page === "2" && "pr-14"
      )}
    >
      <Button label={query.page === "2" ? "Popular / Recent" : "Previous"} />
      <p className="text-2xl font-bold tracking-wider">
        {pageOneOrNoQuery
          ? "Popular / Recent"
          : `Page ${Number(query?.page?.toString()) - 1 ?? 1}`}
      </p>
      <Button isNext label={pageOneOrNoQuery ? "All Listings" : "Next Page"} />
    </div>
  );
};

export const GameContainer: React.FC<
  PropsWithChildren<{ label: string; className?: string }>
> = ({ children, label, className }) => (
  <div className={clsx("p-4 sm:pb-16 sm:px-6 w-full lg:px-32", className)}>
    <h1 className="text-2xl font-semibold tracking-wider text-gray-700 mb-3">
      {label}
    </h1>
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
      {children}
    </div>
  </div>
);

export type Props = {
  games: Pick<
    Game,
    | "id"
    | "name"
    | "platforms"
    | "rating"
    | "released"
    | "background_image"
    | "slug"
  >[];
};

export default Home;
