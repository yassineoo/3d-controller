"use client";
import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./planet/scene.gltf");
  return <primitive object={gltf.scene} scale={1.0} />;
};

export default function Home3DPlanet() {
  return (
    <div>
      <div className="w-full h-screen">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
          <OrbitControls enableRotate={true} />
          <Suspense fallback={null}>
            <Model />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
