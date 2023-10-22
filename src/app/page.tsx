import Home3D from "@/components/try";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white">
      <Head>
        <title>Next.js + Three.js</title>
      </Head>
      <header className="bg-blue">
        <h1>Next.js + Three.js</h1>
      </header>
      <main className="bg-red">
        <h1>My Next.js + Three.js App</h1>
        <Home3D />
      </main>
    </div>
  );
}
