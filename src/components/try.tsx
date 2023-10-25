import React, { Suspense, useEffect } from "react";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const Model = () => {
  const gltf = useLoader(GLTFLoader, "./desktop_pc/scene.gltf");

  useEffect(() => {
    gltf.scene.position.set(5, 0, 0);
  }, []);

  const { camera } = useThree();
  // const { zoom, rotate } = camera.controls;

  useFrame(() => {
    const obj = gltf.scene;
    obj.updateMatrixWorld();

    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    obj.matrixWorld.decompose(pos, quat, scale);

    console.log({
      position: pos,
      rotation: obj.rotation,
      zoom: scale,
    });
  });

  return <primitive object={gltf.scene} />;
};

export default function App() {
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
