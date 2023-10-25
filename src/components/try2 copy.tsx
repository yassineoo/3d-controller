import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useState, useRef } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default function App() {
  const [rotationDeg, setRotationDeg] = useState(0);

  return (
    <div className="flex flex-col h-screen">
      <input
        type="number"
        value={rotationDeg}
        onChange={(e) => setRotationDeg(Number(e.target.value))}
      />

      <Canvas
        className="flex-1 h-full"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 50 }}
      >
        <OrbitControls enableRotate={true} />
        <Suspense fallback={null}>
          <Model rotation={[3, rotationDeg, 0]} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
type ModelProps = {
  rotation: [number, number, number];
};

const Model = ({ rotation }: ModelProps) => {
  const gltf = useLoader(GLTFLoader, "./planet/scene.gltf");

  // Track the previous rotation to detect changes
  const prevRotation = useRef([0, 0, 0]);

  useFrame(({ camera, scene }) => {
    // Extract the rotation in degrees
    const currentRotation = {
      x: camera.rotation.x * THREE.MathUtils.RAD2DEG,
      y: camera.rotation.y * THREE.MathUtils.RAD2DEG,
      z: camera.rotation.z * THREE.MathUtils.RAD2DEG,
    };

    // Round the current rotation values to four decimal places
    const roundedCurrentRotation = {
      x: Number(currentRotation.x.toFixed(2)),
      y: Number(currentRotation.y.toFixed(2)),
      z: Number(currentRotation.z.toFixed(2)),
    };

    // Check if the rotation has changed since the last frame
    if (
      roundedCurrentRotation.x !== prevRotation.current[0] ||
      roundedCurrentRotation.y !== prevRotation.current[1] ||
      roundedCurrentRotation.z !== prevRotation.current[2]
    ) {
      // Log the new rotation values
      console.log("Rotation (degrees):", roundedCurrentRotation);

      // Update the previous rotation
      prevRotation.current = [
        roundedCurrentRotation.x,
        roundedCurrentRotation.y,
        roundedCurrentRotation.z,
      ];
    }
  });

  return <primitive object={gltf.scene} />;
};
