import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Game } from "../types";
import { RawgApiClient } from "../components/rawgApiClient";
import { Props } from "../pages";
import pick from "lodash/pick";

export const useGetGames = () => {
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
            popularGames.map((game) => mapToProps(game)) ?? [];

          const mappedRecGames =
            recentGames.map((game) => mapToProps(game)) ?? [];
          setPopularGames(mappedPopGames);
          setRecentGames(mappedRecGames);
        } else {
          games = await rawgApiClient.getGames(page);
        }
      }
      const mappedGames = games.map((game) => mapToProps(game)) ?? [];
      setGames(mappedGames);
      setLoading(false);
    };

    fetchData();
  }, [query.page, query.search, page]);

  return { games, popularGames, recentGames, loading, query, page };
};

const mapToProps = (game: Game) => {
  return pick(game, [
    "id",
    "name",
    "platforms",
    "rating",
    "released",
    "background_image",
    "slug",
  ]);
};
