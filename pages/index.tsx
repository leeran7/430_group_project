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
  const { games, popularGames, loading, query } = useGetGames();


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





      <div>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1>Popular Products</h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {popularGames.length > 0
            ? games?.map((popularGames) => (
                <span key={popularGames.id} className="relative flex flex-col">
                  <Link href={`/game/${popularGames.id}`}>
                    <a className="group flex flex-col gap-y-1 p-2 hover:shadow-md focus:shadow-md hover:md:shadow-2xl  rounded-lg shadow-gray-300 hover:sm:scale-110 transition-all ease-in-out">
                      <div className="flex flex-col overflow-hidden rounded-lg bg-gray-200">
                        <img
                          src={popularGames.background_image}
                          alt={popularGames.name}
                          className="h-52 sm:h-40"
                        />
                      </div>
                      <h3 className="text-gray-700 font-semibold">
                        {popularGames.name}
                      </h3>
                      <p className="text-gray-800">
                        Price: {getPricing(popularGames.released, popularGames.rating)}
                      </p>
                      <p className="text-gray-900">
                        Release Date: {popularGames.released}
                      </p>
                      <p className="flex gap-x-1">Rating: {popularGames.rating} / 5</p>
                      <span className="flex gap-x-1">
                        {popularGames.platforms
                          .map((platform) => platform.platform.name)
                          .map(getSymbols)}
                      </span>
                    </a>
                  </Link>
                  {user && (
                    <button
                      onClick={() => alert(popularGames.id)}
                      className="absolute bottom-0 right-0 py-2 px-5 z-10 bg-green-400 hover:bg-green-500 rounded"
                    >
                      Add to cart
                    </button>
                  )}
                </span>
              ))
            : null}
        </div>
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
  const [popularGames, setPopularGames] = useState<Props["games"]>([]);

  const [loading, setLoading] = useState(true);

  const { query } = useRouter();

  const page = query.page?.toString() ?? "1";

  useEffect(() => {
    const fetchData = async () => {
      const rawgApiClient = new RawgApiClient();
      let games: Game[] = [];
      let popularGames: Game[] = [];
      let recentGames: Game[] = [];

      if (query.search) {
        const search = query.search.toString();
        games = await rawgApiClient.searchGames(search, page);
      } else {
        //games = await rawgApiClient.getGames(page);
        games = await rawgApiClient.getGames(page);
        popularGames = await rawgApiClient.getPopularGames(page);
        recentGames = await rawgApiClient.getRecentGames(page);
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


        const mappedPopGames =
        popularGames.map((game) =>
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
      setPopularGames(mappedPopGames)
      setLoading(false);
    };

    fetchData();
  }, [query.page, query.search, page]);

  return { games, popularGames, loading, query };
};

export type Props = {
  games: Pick<
    Game,
    "id" | "name" | "platforms" | "rating" | "released" | "background_image"
  >[];
};

export default Home;
