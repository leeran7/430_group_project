import { useUser } from "../components/firebase";
import { useCallback, useEffect, useState } from "react";
import { User } from "../types";
import { getUserById, updateUser } from "../components/firebase";
import { toast } from "react-toastify";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [userInfo, setUserInfo] = useState<User>({} as User);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      if (user) {
        const info = await getUserById(user.uid);
        setUserInfo(info as User);
      }
      setLoading(false);
    };
    getUser();
  }, [user]);

  const onDeleteCartItem = useCallback(
    async (id: number) => {
      if (user) {
        const newCart = userInfo.cart.filter((item) => item.id !== id);
        await updateUser(user.uid, {
          ...userInfo,
          cart: newCart,
        });
        setUserInfo({
          ...userInfo,
          cart: newCart,
        });
        toast.success("Game deleted from cart");
      }
    },
    [user, userInfo]
  );

  const getWishlist = useCallback(() => {
    if (user) {
      return userInfo.wishlist;
    }
  }, [user, userInfo]);

  const getIsInWishList = useCallback(
    (id: number) => {
      return !!userInfo?.wishlist?.find((item) => item.id === id);
    },
    [userInfo?.wishlist]
  );

  const onWishlistAdd = useCallback(
    async (game: User["wishlist"][0]) => {
      setLoading(true);
      if (user) {
        if (getIsInWishList(game.id)) {
          toast.error("Game already in wishlist");
          return;
        }
        const newWishlist = [...userInfo.wishlist, game];
        await updateUser(user.uid, {
          ...userInfo,
          wishlist: newWishlist,
        });
        setUserInfo({
          ...userInfo,
          wishlist: newWishlist,
        });
        toast.success("Game added to wishlist");
      }
      setLoading(false);
    },
    [user, getIsInWishList, userInfo]
  );

  const onWishlistDelete = useCallback(
    async (id: number) => {
      if (user) {
        setLoading(true);
        const newWishlist = userInfo.wishlist.filter((item) => item.id !== id);
        await updateUser(user.uid, {
          ...userInfo,
          wishlist: newWishlist,
        });
        await setUserInfo({
          ...userInfo,
          wishlist: newWishlist,
        });
        toast.info("Game deleted from wishlist");
        setLoading(false);
      }
    },
    [user, userInfo]
  );

  const onAddCartItem = useCallback(
    async (game: User["cart"][0]) => {
      if (user) {
        setLoading(true);
        if (userInfo.cart.find((item) => item.id === game.id)) {
          toast.error("Game already in cart");
          return;
        }
        const newCart = [...userInfo.cart, game];
        await updateUser(user.uid, {
          ...userInfo,
          cart: newCart,
        });
        setUserInfo({
          ...userInfo,
          cart: newCart,
        });
        toast.success("Game added to cart");
        setLoading(false);
      }
    },
    [user, userInfo]
  );

  return {
    user: userInfo,
    loading,
    onDeleteCartItem,
    onAddCartItem,
    onWishlistAdd,
    getIsInWishList,
    onWishlistDelete,
    getWishlist,
  };
};
