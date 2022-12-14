import { CgSpinner } from "react-icons/cg";
import { useUser } from "../components/firebase";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { GameCard, GameContainer } from ".";

const Wishlist = () => {
  const [user] = useUser();
  const { getWishlist, loading } = useUpdateUser();
  const wishlist = getWishlist();

  if (loading || !user || !wishlist) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Wishlist Loading...</h1>
        <CgSpinner className="animate-spin" size="150px" />
      </div>
    );
  }

  return (
    <GameContainer label="Wishlist" className="mt-[120px]">
      {wishlist?.length > 0 ? (
        wishlist?.map((game) => (
          <GameCard key={game.id} game={game} userExists={!!user} />
        ))
      ) : (
        <p>No Games added yet!</p>
      )}
    </GameContainer>
  );
};

export default Wishlist;
