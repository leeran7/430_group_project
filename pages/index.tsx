import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { RawgApiClient } from "../components/rawgApiClient";
import { Game } from "../types";
import { useUser } from "../components/firebase";
import { pick } from "lodash";
import { useRouter } from "next/router";
import { Button } from "../components/PageButton";
import Link from "next/link";
import { getPricing, getSymbols } from "../components/lib";
import { CgSpinner } from "react-icons/cg";
import { useUserCart } from "./cart";
import { FaCartPlus } from "react-icons/fa";

const Home: NextPage = () => {
  const [user] = useUser();
  const { games, loading, query } = useGetGames();
  const { loading: userLoading, onAdd } = useUserCart();
  if (loading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
        <CgSpinner className="animate-spin" size="98px" />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="flex gap-x-10 items-center justify-center text-center py-10 w-full">
        <Button label="Previous" />
        <p>Page {query.page ?? 1}</p>
        <Button isNext label="Next Page" />
      </div>
      <div className="pb-16 pt-10 px-4 sm:pb-24 sm:px-6 w-full lg:px-32">
        <h1 className="sr-only">Products</h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
          {games.length > 0
            ? games?.map((game) => (
                <span
                  key={game.id}
                  className="relative flex flex-col z-20 shadow-md rounded-lg focus:shadow-md hover:md:shadow-2xl shadow-gray-300 hover:sm:scale-110"
                >
                  <Link href={`/game/${game.id}`}>
                    <a className="group flex flex-col gap-y-1 p-2 transition-all ease-in-out">
                      <div className="flex flex-col overflow-hidden rounded-lg bg-gray-200">
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="h-52 sm:h-40"
                        />
                      </div>
                      <h3 className="text-gray-700 font-semibold">
                        {game.name}
                      </h3>
                      <p className="text-gray-800">
                        Price: {getPricing(game.released, game.rating)}
                      </p>
                      <p className="flex text-xs gap-x-1">
                        Rating: {game.rating} / 5
                      </p>
                    </a>
                  </Link>
                  {user && (
                    <button
                      onClick={async () => {
                        await onAdd({
                          ...pick(game, ["id", "name", "background_image"]),
                          price: getPricing(game.released, game.rating),
                        });
                      }}
                      className="w-16 m-2 self-end text-center flex flex-col items-center justify-center py-2.5 z-10 bg-green-400 hover:bg-green-500 rounded"
                    >
                      <FaCartPlus />
                    </button>
                  )}
                </span>
              ))
            : null}
        </div>
      </div>

      <div className="flex gap-x-10 items-center justify-center text-center py-10">
        <Button label="Previous" />
        <p>Page {query.page ?? 1}</p>
        <Button isNext label="Next Page" />
      </div>
    </div>
  );
};

const useGetGames = () => {
  const [games, setGames] = useState<Props["games"]>([]);
  const [loading, setLoading] = useState(true);

  const { query } = useRouter();

  const page = query.page?.toString() ?? "1";

  useEffect(() => {
    const fetchData = async () => {
      const rawgApiClient = new RawgApiClient();
      let games: Game[] = [];

      if (query.search) {
        const search = query.search.toString();
        games = await rawgApiClient.searchGames(search, page);
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
          ])
        ) ?? [];
      setGames(mappedGames);
      setLoading(false);
    };

    fetchData();
  }, [query.page, query.search, page]);

  return { games, loading, query };
};

export type Props = {
  games: Pick<
    Game,
    "id" | "name" | "platforms" | "rating" | "released" | "background_image"
  >[];
};

export default Home;
