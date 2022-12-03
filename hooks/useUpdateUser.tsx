import { useUser } from "../components/firebase";
import { useCallback, useEffect, useState } from "react";
import { User } from "../types";
import { getUserById, updateUser } from "../components/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [userInfo, setUserInfo] = useState<User>({} as User);
  const router = useRouter();

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
  }, [user, router.pathname]);

  const onDeleteCartItem = useCallback(
    async (id: number) => {
      setLoading(true);
      if (user) {
        const newCart = userInfo.cart.filter((item) => item.id !== id);
        const data = { ...userInfo, cart: newCart };
        await updateUser(user.uid, data);
        setUserInfo(data);
      }
      setLoading(false);
    },
    [user, userInfo]
  );

  const getWishlist = useCallback(() => {
    if (user) {
      return userInfo.wishlist;
    }
  }, [user, userInfo]);

  const getOwned = useCallback(() => {
    if (user) {
      return userInfo.owned;
    }
  }, [user, userInfo]);

  const getIsInWishList = useCallback(
    (id: number) => {
      return !!userInfo?.wishlist?.find((item) => item.id === id);
    },
    [userInfo?.wishlist]
  );

  const getIsInCart = useCallback(
    (id: number) => {
      return !!userInfo?.cart?.find((item) => item.id === id);
    },
    [userInfo?.cart]
  );

  const getIsOwned = useCallback(
    (id: number) => {
      return !!userInfo?.owned?.find((item) => item.id === id);
    },
    [userInfo?.owned]
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
        const data = { ...userInfo, wishlist: newWishlist };
        await updateUser(user.uid, data);
        setUserInfo(data);

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
        const data = { ...userInfo, wishlist: newWishlist };
        await updateUser(user.uid, data);
        await setUserInfo(data);

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
        if (userInfo?.cart.find((item) => item.id === game.id)) {
          toast.error("Game already in cart");
          return;
        }
        if (userInfo?.owned.find((item) => item.id === game.id)) {
          toast.error("You already own this game");
          return;
        }
        const newCart = [...userInfo.cart, game];
        const data = { ...userInfo, cart: newCart };
        await updateUser(user.uid, data);
        setUserInfo(data);

        toast.success("Game added to cart");
        setLoading(false);
      }
    },
    [user, userInfo]
  );

  const onCheckout = useCallback(async () => {
    if (user) {
      setLoading(true);

      const owned = [...userInfo.owned, ...userInfo.cart];
      const wishlist = userInfo.wishlist.filter(
        (item) => !userInfo.cart.find((cartItem) => cartItem.id === item.id)
      );

      const data = { ...userInfo, cart: [], owned, wishlist };

      await updateUser(user.uid, data);
      setUserInfo(data);

      toast.success("Checkout successful");
      setLoading(false);
    }
  }, [user, userInfo]);

  return {
    user: userInfo,
    loading,
    onDeleteCartItem,
    onAddCartItem,
    getIsOwned,
    getIsInCart,
    onWishlistAdd,
    getIsInWishList,
    onWishlistDelete,
    getWishlist,
    getOwned,
    onCheckout,
  };
};
