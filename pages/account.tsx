import { CgSpinner } from "react-icons/cg";
import { useUser } from "../components/firebase";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { GameCard } from ".";
import { GameContainer } from "./index";
const Account = () => {
  const [user] = useUser();
  const { getOwned, loading } = useUpdateUser();
  const owned = getOwned();

  if (loading || !user || !owned) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Your Games Loading...</h1>
        <CgSpinner className="animate-spin" size="150px" />
      </div>
    );
  }

  return (
    <GameContainer label="Owned Games" className="mt-[120px]">
      {owned?.length > 0 ? (
        owned?.map((game) => (
          <GameCard key={game.id} game={game} userExists={!!user} />
        ))
      ) : (
        <p>No Games purchased yet!</p>
      )}
    </GameContainer>
  );
};

export default Account;
