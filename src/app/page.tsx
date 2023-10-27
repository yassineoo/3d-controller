"use client";
import Home3D from "@/components/try";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isClient = typeof window !== "undefined";

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
          <button
            type="button"
            className=" h-16 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              if (isClient) {
                router.push("/connect");
              }
            }}
          >
            desktop pc 3D-Model
          </button>
          <button
            type="button"
            className="h-16 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              if (isClient) {
                router.push("/controller");
              }
            }}
          >
            planet 3D-Model
          </button>
        </div>
      </main>
    </div>
  );
}
