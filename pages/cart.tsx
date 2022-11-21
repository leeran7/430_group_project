import { NextPage } from "next";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { getUserById, useUser, updateUser } from "../components/firebase";
import type { User } from "../types";
import { toast } from "react-toastify";

const Cart: NextPage = () => {
  const { user, loading, onDeleteCartItem } = useUpdateUser();
  const total = useGetTotal(user.cart);
  if (loading || !user.cart) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
        <CgSpinner className="animate-spin" size="98px" />
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="flex shadow-md my-10">
        <div className="w-3/4 bg-white px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">
              {user.cart.length ?? 0} Items
            </h2>
          </div>

          <div className="flex mt-10 mb-5">
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
              Product Details
            </h3>
            <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-4/5">
              Price
            </h3>
          </div>

          {user.cart.map((item) => (
            <div
              key={item.id + item.price}
              className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
            >
              <div className="flex w-2/5">
                <Link href={`/game/${item.id}`}>
                  <a className="hover:shadow-md focus:shadow-md hover:md:shadow-2xl shadow-gray-300 hover:sm:scale-110 transition-all ease-in-out">
                    <div className="w-18">
                      <img
                        className="h-24 rounded-lg"
                        src={item.background_image}
                        alt={item.name}
                      />
                    </div>
                  </a>
                </Link>
                <div className="flex flex-col justify-between ml-4 flex-grow">
                  <Link href={`/game/${item.id}`}>
                    <a className="font-bold text-sm hover:text-indigo-600">
                      {item.name}
                    </a>
                  </Link>

                  <button
                    className="text-left font-semibold hover:text-red-500 text-gray-500 text-xs"
                    onClick={async () => onDeleteCartItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <span className="text-center w-4/5 font-semibold text-sm">
                {item.price}
              </span>
            </div>
          ))}

          <Link href="/">
            <a className="flex font-semibold text-indigo-600 text-sm mt-10">
              <svg
                className="fill-current mr-2 text-indigo-600 w-4"
                viewBox="0 0 448 512"
              >
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
              </svg>
              Continue Shopping
            </a>
          </Link>
        </div>

        <div id="summary" className="w-1/4 px-8 py-10">
          <h1 className="font-semibold text-2xl border-b pb-8">
            Order Summary
          </h1>
          {user.cart.map((item) => (
            <div key={item.id} className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                {item.name}
              </span>
              <span className="font-semibold text-sm">{item.price}</span>
            </div>
          ))}
          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between pt-6 pb-1 text-sm uppercase">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex font-semibold justify-between py-1 text-sm uppercase">
              <span>Taxes</span>
              <span>${(total * 0.08875).toFixed(2)}</span>
            </div>
            <div className="flex font-semibold justify-between py-1 text-sm uppercase">
              <span>Total</span>
              <span>${(total * 1.08875).toFixed(2)}</span>
            </div>
            <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const useGetTotal = (cart: User["cart"] | undefined) => {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (cart) {
      setTotal(
        cart?.reduce(
          (acc, item) => acc + Number(item.price.replace("$", "")),
          0
        )
      );
    }
  }, [cart]);
  return total;
};

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
export default Cart;
