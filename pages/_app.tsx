import Head from "next/head";
import "../globals.css";
import type { AppProps } from "next/app";
import { PropsWithChildren, useState } from "react";
import Link from "next/link";
import { logout, useUser } from "../components/firebase";
import { useRouter } from "next/router";
import { query } from "firebase/firestore/lite";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PageLayout>
      <Component {...pageProps} />
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
  const navigation = [
    { name: "Home", href: "/", show: true },
    { name: "About", href: "/about", show: true },
    { name: "Wishlist", href: "/wishlist", show: !!user },
  ];

  return (
    <header className="bg-[#0E3276]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-[#0E3276]-500 lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <a>
                <span className="sr-only">GAMES R US</span>
                <img className="h-24 w-auto" src="/logo.png" alt="" />
              </a>
            </Link>
            <div className="ml-10 hidden space-x-8 lg:block">
              {navigation.map((link) => {
                if (!link.show) return null;
                return (
                  <Link key={link.name} href={link.href}>
                    <a className="text-lg font-medium text-white hover:underline transition-all ease-in-out duration-100 hover:text-[#0E3276]-50">
                      {link.name}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>

          <SearchBar />

          <div className="ml-10 space-x-4">
            {user ? (
              <button
                onClick={async () => {
                  await logout();
                }}
                className={AuthButtonStyles}
              >
                Logout
              </button>
            ) : (
              <Link href="/login">
                <a className={AuthButtonStyles}>Login</a>
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center space-x-6 py-4 lg:hidden">
          {navigation.map((link) => {
            if (!link.show) return null;
            return (
              <Link key={link.name} href={link.href}>
                <a className="text-base font-medium text-white hover:text-[#0E3276]-50">
                  {link.name}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

const SearchBar = () => {
  const { push, pathname } = useRouter();
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-xl rounded-full bg-white">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await push({ pathname, query: { page: "1", search } });
          setSearch("");
        }}
        className="flex relative mx-auto w-max"
      >
        <input
          type="search"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="peer cursor-pointer relative z-10 h-12 w-12 rounded-full border bg-transparent pl-12 outline-none text-black focus:w-full focus:cursor-text focus:border-gray-300 focus:pl-16 focus:pr-4 "
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-gray-500 px-3.5 peer-focus:border-gray-300 peer-focus:stroke-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </form>
    </div>
  );
};

const AuthButtonStyles =
  "inline-block rounded-full border border-transparent bg-color1 py-2 px-4 text-lg font-medium transition-colors ease-in-out text-white hover:bg-opacity-75";

export default MyApp;
