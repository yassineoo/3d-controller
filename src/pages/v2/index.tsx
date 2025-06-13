"use client";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import QRCode from "qrcode";
import Image from "next/image";

const AVAILABLE_OBJECTS = [
  { name: "Desktop PC", query: "desktop_pc" },
  { name: "Planet", query: "planet" },
  { name: "Swim Villa", query: "swimvilla" },
];

export default function IndexPage() {
  const [qrcode, setQrcode] = useState("");
  const [connect, setConnect] = useState(false);
  const [rotationDeg, setRotationDeg] = useState([0, 0, 0]);
  const [rotationPos, setRotationPos] = useState([0, 0, 5]);
  const [colorEdit, setColor] = useState({ color: "#fff", name: "" });
  const [currentObjectIndex, setCurrentObjectIndex] = useState(1); // Start with planet (index 1)
  const [peer, setPeer] = useState<any>(null);

  const currentObject = AVAILABLE_OBJECTS[currentObjectIndex];

  // Function to receive messages from controller
  const receiveMessage = (data: unknown) => {
    if (!connect) setConnect(true);

    const receivedValues = data as {
      rotation: { x: number; y: number; z: number };
      position: { x: number; y: number; z: number };
      colorEdit: { color: string; name: string };
      objectSwitch?: "next" | "prev";
    };

    // Handle object switching
    if (receivedValues.objectSwitch) {
      if (receivedValues.objectSwitch === "next") {
        setCurrentObjectIndex((prev) => (prev + 1) % AVAILABLE_OBJECTS.length);
      } else if (receivedValues.objectSwitch === "prev") {
        setCurrentObjectIndex((prev) => (prev - 1 + AVAILABLE_OBJECTS.length) % AVAILABLE_OBJECTS.length);
      }
      return; // Don't process other values when switching objects
    }

    const receivedRotationValues = receivedValues.rotation;
    setRotationDeg([receivedRotationValues.x, receivedRotationValues.y, receivedRotationValues.z]);

    setRotationPos([receivedValues.position.x, receivedValues.position.y, receivedValues.position.z]);

    if (receivedValues.colorEdit) setColor(receivedValues.colorEdit);
  };

  const switchObject = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentObjectIndex((prev) => (prev + 1) % AVAILABLE_OBJECTS.length);
    } else {
      setCurrentObjectIndex((prev) => (prev - 1 + AVAILABLE_OBJECTS.length) % AVAILABLE_OBJECTS.length);
    }
  };

  useEffect(() => {
    const Peer = require("peerjs").default;
    const newPeer = new Peer();
    setPeer(newPeer);

    newPeer.on("open", () => {
      console.log("Peer ID:", newPeer.id);
      const url = `${window.location.origin}/v2/controller?id=${newPeer.id}`;
      console.log(url);

      QRCode.toDataURL(url)
        .then((url) => {
          setQrcode(url);
        })
        .catch((err) => {
          console.error(err);
        });
    });

    newPeer.on("connection", (connection: any) => {
      console.log("connection established");

      connection.on("data", receiveMessage);

      connection.on("close", () => {
        console.log("Connection closed");
        setConnect(false);
      });
    });

    return () => {
      if (newPeer) {
        newPeer.destroy();
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <h1 className="font-extrabold text-xl text-center">AR Object Controller</h1>
      </header>

      {/* Connection Status */}
      {!connect && (
        <div className="flex flex-col justify-center items-center flex-1 bg-gray-100">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">Scan QR Code to Connect Your Phone</h2>
          {qrcode && (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img className="w-64 h-64" src={qrcode} alt="QR code" />
            </div>
          )}
          <p className="mt-4 text-gray-600 text-center max-w-md">Use your phone's camera to scan the QR code and start controlling 3D objects</p>
        </div>
      )}

      {/* 3D Canvas when connected */}
      {connect && (
        <div className="flex-1 relative">
          {/* Object Info Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-70 text-white p-3 rounded-lg">
            <h3 className="font-bold">Current Object:</h3>
            <p>{currentObject.name}</p>
          </div>

          {/* Object Switch Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => switchObject("prev")}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg transition-colors"
              title="Previous Object"
            >
              ← Prev
            </button>
            <button
              onClick={() => switchObject("next")}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg transition-colors"
              title="Next Object"
            >
              Next →
            </button>
          </div>

          <Canvas className="w-full h-full" shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <Model rotation={rotationDeg} position={rotationPos} objectName={currentObject.query} colorEdit={colorEdit} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}

type ModelProps = {
  rotation: number[];
  position: number[];
  objectName: string;
  colorEdit: { color: string; name: string };
};

const Model = ({ rotation, position, objectName, colorEdit }: ModelProps) => {
  const gltf = useLoader(GLTFLoader, `./${objectName}/scene.gltf`);

  const traverseMaterials = (node: any) => {
    if (node.isMesh && node.material) {
      if (Array.isArray(node.material)) {
        let selectedMaterial = node.material.find((material: any) => material.name === colorEdit?.name);
        const randomColor = new THREE.Color(colorEdit?.color);
        selectedMaterial?.color?.set(randomColor);
      } else if (node?.material?.name === colorEdit?.name) {
        const randomColor = new THREE.Color(colorEdit?.color);
        node.material?.color?.set(randomColor);
      }
    }
    if (node.children) {
      node.children.forEach(traverseMaterials);
    }
  };

  const prevRotation = useRef([0, 0, 0]);

  useFrame(({ camera, scene }) => {
    camera.rotation.set(rotation[0], rotation[1], rotation[2]);
    camera.position.set(position[0], position[1], position[2]);
    traverseMaterials(scene);
    prevRotation.current = rotation;
  });

  return <primitive object={gltf.scene} />;
};
