import { CgSpinner } from "react-icons/cg";
import { useUser } from "../components/firebase";
import { useUpdateUser } from "./cart";
import { GameCard } from ".";

const Wishlist = () => {
  const [user] = useUser();
  const { getWishlist, loading } = useUpdateUser();
  const wishlist = getWishlist();

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
        <CgSpinner className="animate-spin" size="98px" />
      </div>
    );
  }
  if (!wishlist) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">No wishlist</h1>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-10 px-4 sm:pb-24 sm:px-6 w-full lg:px-32">
      <h1 className="sr-only">Products</h1>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8">
        {wishlist?.length > 0 ? (
          wishlist?.map((game) => (
            <GameCard key={game.id} game={game} userExists={!!user} />
          ))
        ) : (
          <p>No Games added yet!</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
