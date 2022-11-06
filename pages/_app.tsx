import Head from "next/head";
import "../globals.css";
import type { AppProps } from "next/app";
import { PropsWithChildren } from "react";
import Link from "next/link";
import { useUser, logout } from "../firebase";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PageLayout>
      <Component {...pageProps} />
    </PageLayout>
  );
}

const navigation = [
  { name: "Games", href: "/", current: true },
  { name: "About", href: "/about", current: false },
];

const NavBar = () => {
  const [user] = useUser();
  return (
    <header className="bg-indigo-600">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-indigo-500 py-6 lg:border-none">
          <div className="flex items-center">
            <a href="#">
              <span className="sr-only">Your Company</span>
              <img className="h-16 w-auto" src="/logo.png" alt="" />
            </a>
            <div className="ml-10 hidden space-x-8 lg:block">
              {navigation.map((link) => (
                <Link key={link.name} href={link.href}>
                  <a className="text-base font-medium text-white hover:text-indigo-50">
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="ml-10 space-x-4">
            {user ? (
              <button
                onClick={async () => {
                  await logout();
                }}
                className="inline-block rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-base font-medium text-white hover:bg-opacity-75"
              >
                Logout
              </button>
            ) : (
              <Link href="/login">
                <a className="inline-block rounded-md border border-transparent bg-indigo-500 py-2 px-4 text-base font-medium text-white hover:bg-opacity-75">
                  Sign in
                </a>
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center space-x-6 py-4 lg:hidden">
          {navigation.map((link) => (
            <Link key={link.name} href={link.href}>
              <a className="text-base font-medium text-white hover:text-indigo-50">
                {link.name}
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

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

export default MyApp;
