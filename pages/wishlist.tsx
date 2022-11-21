import { CgSpinner } from "react-icons/cg";
import { useUser } from "../components/firebase";
import { useUpdateUser } from "./cart";

const Wishlist = () => {
  const [user] = useUser();
  const { user: userInfo, loading } = useUpdateUser();

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
        <CgSpinner className="animate-spin" size="98px" />
      </div>
    );
  }

  return <div>{JSON.stringify(userInfo)}</div>;
};

export default Wishlist;
