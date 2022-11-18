import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { RawgApiClient } from "../components/rawgApiClient";
import { Game } from "../types";
import { useUser } from "../components/firebase";
import { pick } from "lodash";
import { useRouter } from "next/router";
import { Button } from "../components/PageButton";
import Link from "next/link";
import { getPricing, getSymbols } from "../components/lib";
import { CgSpinner } from "react-icons/cg";

const Home: NextPage = () => {
  const [user] = useUser();
  const { games, loading, query } = useGetGames();

  if (loading) {
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
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="sr-only">Products</h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {games.length > 0
            ? games?.map((game) => (
                <span key={game.id} className="relative flex flex-col">
                  <Link href={`/game/${game.id}`}>
                    <a className="group flex flex-col gap-y-1 p-2 hover:shadow-md focus:shadow-md hover:md:shadow-2xl  rounded-lg shadow-gray-300 hover:sm:scale-110 transition-all ease-in-out">
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
                      <p className="text-gray-900">
                        Release Date: {game.released}
                      </p>
                      <p className="flex gap-x-1">Rating: {game.rating} / 5</p>
                      <span className="flex gap-x-1">
                        {game.platforms
                          .map((platform) => platform.platform.name)
                          .map(getSymbols)}
                      </span>
                    </a>
                  </Link>
                  {user && (
                    <button
                      onClick={() => alert(game.id)}
                      className="absolute bottom-0 right-0 py-2 px-5 z-10 bg-green-400 hover:bg-green-500 rounded"
                    >
                      Add to cart
                    </button>
                  )}
                  {user && (
                    <button 
                    onClick={() => alert(game.id)}
                    className="absolute top-0 right-0 text-red-500 background-transparent font-bold uppercase px-2 py-3 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                    type="button">
                      <svg className="w-6 h-6" fill="red" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
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
