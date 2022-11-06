import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { getSymbols, getPricing } from "./game/[slug]";
import { RawgApiClient, Game } from "../components/rawgApiClient";
import { useUser } from "../firebase";
import { pick } from "lodash";
import { useRouter } from "next/router";

const Home: NextPage<Props> = ({ games }) => {
  const [user] = useUser();
  const router = useRouter();
  const { query } = router;

  return (
    <div>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="sr-only">Products</h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {games.length > 0
            ? games?.map((game) => {
                return (
                  <span className="relative flex flex-col" key={game.id}>
                    <Link href={`/game/${game.id}`}>
                      <a className="group flex flex-col gap-y-1 p-2 hover:shadow-2xl rounded-lg shadow-gray-300 hover:scale-110 transition-all ease-in-out">
                        <div className="flex flex-col overflow-hidden rounded-lg bg-gray-200">
                          <img
                            src={game.background_image}
                            alt={game.name}
                            className="h-40"
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
                        <p className="flex gap-x-1">
                          Rating: {game.rating} / 5
                        </p>
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
                  </span>
                );
              })
            : null}
        </div>
      </div>

      <div className="flex gap-x-10 items-center justify-center text-center py-10">
        {!query.page || query.page === "1" ? null : (
          <button
            onClick={() => {
              const page = query.page ? parseInt(query.page as string) : 1;
              router.push("/?page=" + (page - 1));
            }}
            className="bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded"
          >
            Previous Page
          </button>
        )}
        <p>Page {query.page ?? 1}</p>
        <button
          onClick={() => {
            const page = query.page ? parseInt(query.page as string) : 1;
            router.push("/?page=" + (page + 1));
          }}
          className="bg-gray-200 hover:bg-gray-300 py-2 px-5 rounded"
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

type Props = {
  games: Pick<
    Game,
    "id" | "name" | "platforms" | "rating" | "released" | "background_image"
  >[];
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const rawgApiClient = new RawgApiClient();
  const games = await rawgApiClient.getGames(query.page?.toString() ?? "1");

  return {
    props: {
      games:
        games.map((game) =>
          pick(game, [
            "id",
            "name",
            "platforms",
            "rating",
            "released",
            "background_image",
          ])
        ) ?? [],
    },
  };
};

export default Home;
