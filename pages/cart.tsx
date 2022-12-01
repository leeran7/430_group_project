import { NextPage } from "next";
import Link from "next/link";
import { CgSpinner } from "react-icons/cg";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useGetTotal } from "../hooks/useGetTotal";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { FaSadCry } from "react-icons/fa";
import clsx from "clsx";

const Cart: NextPage = () => {
  const { user, loading, onDeleteCartItem } = useUpdateUser();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
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

          {user.cart?.length > 0 ? (
            <>
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
                        onClick={async () => {
                          await onDeleteCartItem(item.id);
                          toast.success("Game deleted from cart");
                        }}
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
            </>
          ) : (
            <p className="text-sm mt-10">
              <FaSadCry className="inline mr-1" />
              No games in your cart!
            </p>
          )}

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

        <div
          id="summary"
          className="flex flex-col justify-between w-1/4 px-8 py-10"
        >
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
          </div>
          <button
            disabled={total === 0}
            onClick={() => setIsCheckingOut(true)}
            className={clsx(
              total === 0
                ? "cursor-not-allowed bg-gray-500"
                : "bg-indigo-500 hover:bg-indigo-600",
              "font-semibold self-end mt-5 py-3 text-sm text-white uppercase w-full"
            )}
          >
            Checkout
          </button>
        </div>
      </div>
      <CheckoutModal
        open={isCheckingOut}
        setOpen={setIsCheckingOut}
        total={(total * 1.08875).toFixed(2)}
      />
    </div>
  );
};

const CheckoutModal: React.FC<{
  open: boolean;
  setOpen: (v: boolean) => void;
  total: string;
}> = ({ open, setOpen, total }) => {
  const { onCheckout } = useUpdateUser();
  const { push } = useRouter();
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <AiOutlineLoading3Quarters
                      className="h-6 w-6 text-green-600 rotate-90"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 text-gray-900"
                    >
                      Your total is <span className="font-bold">${total}</span>
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to checkout?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4  mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border-2 border-transparent border-indigo-600 px-4 py-2 text-base font-medium text-indigo-600 shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Go back
                  </button>

                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={async () => {
                      await onCheckout();
                      setOpen(false);
                      push("/account");
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Cart;
