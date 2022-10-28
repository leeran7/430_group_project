import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { logout, useUser } from "../firebase";
const Home: NextPage = () => {
  const [user] = useUser();
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-sm font-bold">HELLO THERE</h1>
        {user ? (
          <button
            onClick={async () => {
              await logout();
              alert("Logged out");
            }}
          >
            logout
          </button>
        ) : (
          <Link href="/home">Login</Link>
        )}
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
