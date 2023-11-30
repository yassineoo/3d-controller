"use client";
import Head from "next/head";
import { useRouter } from "next/router";

type Content = {
  title: string;
  query: string;
};

function ConnectButton({ title, query }: Content) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="w-25 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
      onClick={() => {
        router.push({
          pathname: "/connect",
          query: { component: query },
        });
      }}
    >
      {title}
    </button>
  );
}

export default function Home() {
  return (
    <div className="bg-white">
      <Head>
        <title>Next.js + Three.js</title>
      </Head>
      <header className="bg-blue-600">
        <h1 className="font-extrabold   text-xl">My Next.js + Three.js App</h1>
      </header>
      <main className="bg-red flex flex-col">
        <div className="flex flex-row justify-around h-96 items-center">
          <ConnectButton title="Desktop" query="desktop_pc" />
          <ConnectButton title="planet" query="planet" />
          <ConnectButton title="swimVilla" query="swimvilla" />
        </div>
      </main>
    </div>
  );
}
