import type { NextPage } from "next";
import { GameContainer } from "../components/GameContainer";
import { Game } from "../types";
import { useUser } from "../components/firebase";
import { PageButtons } from "../components/PageButtons";
import { CgSpinner } from "react-icons/cg";
import { useGetGames } from "../hooks/useGetGames";
import { GameCard } from "../components/GameCard";

const Home: NextPage = () => {
  const [user] = useUser();
  const { games, popularGames, recentGames, loading, query } = useGetGames();
  const pageOneOrNoQuery = query.page === "1" || !query.page;
  if (loading) {
    return (
      <div className="flex flex-col">
        <PageButtons pageOneOrNoQuery={pageOneOrNoQuery} />
        <div className="flex flex-col items-center justify-between flex-grow">
          <CgSpinner className="animate-spin" size="98px" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageButtons pageOneOrNoQuery={pageOneOrNoQuery} />
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

      <PageButtons pageOneOrNoQuery={pageOneOrNoQuery} />
    </div>
  );
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
