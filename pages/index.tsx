import type { NextPage } from "next";
import { useState, useEffect, PropsWithChildren } from "react";
import { RawgApiClient } from "../components/rawgApiClient";
import { Game, User } from "../types";
import { useUser } from "../components/firebase";
import { useRouter } from "next/router";
import { Button } from "../components/PageButton";
import Link from "next/link";
import { getPricing } from "../components/lib";
import { CgSpinner } from "react-icons/cg";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { FaCartPlus } from "react-icons/fa";
import clsx from "clsx";
import pick from "lodash/pick";

const Home: NextPage = () => {
  const [user] = useUser();
  const { games, popularGames, recentGames, loading, query } = useGetGames();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
        <CgSpinner className="animate-spin" size="98px" />
      </div>
    );
  }
  const pageOneOrNoQuery = query.page === "1" || !query.page;

  return (
    <div className="flex flex-col">
      <div className="flex gap-x-10 items-center justify-center text-center py-10 w-full">
        <Button label="Previous" />
        <p>Page {query.page ?? 1}</p>
        <Button
          isNext
          label={pageOneOrNoQuery ? "All Listings" : "Next Page"}
        />
      </div>

      {pageOneOrNoQuery ? (
        <>
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
        </>
      ) : (
        <GameContainer label="All Games">
          {games.length > 0
            ? games?.map((game) => (
                <GameCard key={game.id} game={game} userExists={!!user} />
              ))
            : null}
        </GameContainer>
      )}

      <div className="flex gap-x-10 items-center justify-center text-center py-10">
        <Button label="Previous" />
        <p>Page {query.page ?? 1}</p>
        <Button
          isNext
          label={pageOneOrNoQuery ? "All Listings" : "Next Page"}
        />
      </div>
    </div>
  );
};

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

const GameContainer: React.FC<PropsWithChildren<{ label: string }>> = ({
  children,
  label,
}) => (
  <div className="p-4 sm:pb-16 sm:px-6 w-full lg:px-32">
    <h1 className="text-2xl font-semibold text-gray-700 mb-1">{label}</h1>
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
      {children}
    </div>
  </div>
);

const useGetGames = () => {
  const [games, setGames] = useState<Props["games"]>([]);
  const [popularGames, setPopularGames] = useState<Props["games"]>([]);
  const [recentGames, setRecentGames] = useState<Props["games"]>([]);
  const [loading, setLoading] = useState(true);

  const { query } = useRouter();

  const page = query.page?.toString() ?? "1";

  useEffect(() => {
    const fetchData = async () => {
      const rawgApiClient = new RawgApiClient();
      let games: Game[] = [];
      let popularGames: Game[] = [];
      let recentGames: Game[] = [];

      setLoading(true);

      if (query.search) {
        const search = query.search.toString();
        games = await rawgApiClient.searchGames(search, page);
      } else {
        if (page === "1") {
          popularGames = await rawgApiClient.getPopularGames();
          recentGames = await rawgApiClient.getRecentGames();
          const mappedPopGames =
            popularGames.map((game) =>
              pick(game, [
                "id",
                "name",
                "platforms",
                "rating",
                "released",
                "background_image",
                "slug",
              ])
            ) ?? [];

          const mappedRecGames =
            recentGames.map((game) =>
              pick(game, [
                "id",
                "name",
                "platforms",
                "rating",
                "released",
                "background_image",
                "slug",
              ])
            ) ?? [];
          setPopularGames(mappedPopGames);
          setRecentGames(mappedRecGames);
        } else {
          games = await rawgApiClient.getGames(page);
        }
        const mappedGames =
          games.map((game) =>
            pick(game, [
              "id",
              "name",
              "platforms",
              "rating",
              "released",
              "background_image",
              "slug",
            ])
          ) ?? [];
        setGames(mappedGames);
      }
      setLoading(false);
    };

    fetchData();
  }, [query.page, query.search, page]);

  return { games, popularGames, recentGames, loading, query, page };
};

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
