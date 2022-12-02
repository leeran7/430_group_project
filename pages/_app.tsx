import Head from "next/head";
import "../globals.css";
import type { AppProps } from "next/app";
import { PropsWithChildren, useState } from "react";
import Link from "next/link";
import { logout, useUser } from "../components/firebase";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import { CgProfile } from "react-icons/cg";
import { Menu } from "@headlessui/react";
import { BsCheck } from "react-icons/bs";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PageLayout>
      <Component {...pageProps} />
      <ToastContainer />
    </PageLayout>
  );
}

const PageLayout: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Head>
        <title>Games-R-Us</title>
        <meta name="description" content="Games-R-Us" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <NavBar />
      <main className="flex-grow">{children}</main>
      <footer></footer>
    </div>
  );
};

const NavBar = () => {
  const [user] = useUser();
  const { pathname } = useRouter();
  const navigation = [
    { name: "Your Games", href: "/account", show: !!user },
    { name: "Wishlist", href: "/wishlist", show: !!user },
    { name: "Cart", href: "/cart", show: !!user },
  ];

  return (
    <header className="bg-color1">
      <nav className="mx-auto max-w-7xl px-4" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-[#0E3276]-500 lg:border-none tracking-wider">
          <div className="flex items-center">
            <Link href="/">
              <a>
                <span className="sr-only">GAMES R US</span>
                <img className="h-16 sm:h-24 w-auto" src="/logo.png" alt="" />
              </a>
            </Link>
          </div>

          {pathname === "/" && (
            <div
              className={clsx(
                "flex items-center justify-center text-center flex-grow",
                user ? "ml-[22px]" : "mr-20"
              )}
            >
              <SearchBar />
            </div>
          )}

          <div className="flex flex-row items-center gap-x-8 relative">
            {user && (
              <Menu>
                <Menu.Button className={clsx(AuthButtonStyles)}>
                  <CgProfile className="text-2xl" />
                  <Menu.Items className="absolute flex flex-col z-10 mt-5 w-full bg-white border border-gray-200 rounded-md shadow-lg outline-none -translate-x-3">
                    {navigation.map((link) => {
                      if (!link.show) return null;
                      return (
                        <Menu.Item key={link.href}>
                          <Link href={link.href}>
                            <a
                              className={clsx(
                                pathname === link.href
                                  ? "bg-color1 text-white"
                                  : "text-gray-900 hover:bg-gray-200",
                                "flex items-center justify-center relative p-4 text-sm font-medium rounded"
                              )}
                            >
                              {link.name}{" "}
                              {pathname === link.href && (
                                <BsCheck className="absolute right-5" />
                              )}
                            </a>
                          </Link>
                        </Menu.Item>
                      );
                    })}
                  </Menu.Items>
                </Menu.Button>
              </Menu>
            )}
            {user ? (
              <button
                onClick={async () => {
                  await logout();
                }}
                className={AuthButtonStyles}
              >
                Logout
              </button>
            ) : pathname !== "/login" ? (
              <Link href="/login">
                <a className={AuthButtonStyles}>Login</a>
              </Link>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
};

const SearchBar = () => {
  const { push, pathname } = useRouter();
  const [search, setSearch] = useState("");

  return (
    <div className="rounded-full bg-white">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await push({ pathname, query: { page: "2", search } });
          setSearch("");
        }}
        className="flex relative w-full"
      >
        <input
          type="search"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="peer cursor-pointer relative z-10 h-12 w-24 rounded-full bg-transparent pl-8 outline-none text-black focus:w-48 focus:sm:w-64 focus:cursor-text focus:border-gray-300 focus:pl-16 focus:pr-4 transition-all ease-in duration-300"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-gray-300 peer-focus:stroke-gray-500 transition-all ease-in duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </form>
    </div>
  );
};

export const AuthButtonStyles =
  "inline-block tracking-widest rounded-full border border-transparent py-2 px-4 font-medium transition-colors ease-in-out hover:text-white hover:bg-color1 bg-white";

export default MyApp;
