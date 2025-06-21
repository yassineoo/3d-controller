"use client";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

import * as THREE from "three";
import QRCode from "qrcode";

//import Peer from "peerjs";

const AVAILABLE_OBJECTS = [
  { name: "beko 01", query: "./beko-01/RDNG561M20TSX.obj" },
  { name: "beko 02", query: "./beko-02/RDNG561M20SX white.obj" },
];

export default function IndexPage() {
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0); // Start with planet (index 1)

  const currentObject = AVAILABLE_OBJECTS[currentObjectIndex];

  const [qrcode, setQrcode] = useState("");
  const [connect, setConnect] = useState(false);
  const [rotationDeg, setRotationDeg] = useState([0, 0, 0]);
  const [rotationPos, setRotationPos] = useState([
    0, 0, 5,
    // 3.3981969110497063, 0, -1.8340472463730382,
  ]);
  const [colorEdit, setColor] = useState({ color: "#fff", name: "" });
  //  const [zoom, setZoom] = useState(5);
  // Function to send a "hello world" message

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

  useEffect(() => {
    const Peer = require("peerjs").default;
    const peer = new Peer();
    console.log(peer);

    peer.on("open", () => {
      console.log("Peer ID:", peer.id);
      const url = `${window.location.origin}/controller?component=${currentObject.query}&id=${peer.id}`;
      console.log(url);

      QRCode.toDataURL(url)
        .then((url) => {
          setQrcode(url);
          // setPeer(peer);
        })
        .catch((err) => {
          console.error(err);
        });
    });

    peer.on("connection", (connection: any) => {
      // handle connection
      console.log("connection");
      console.log(connection);

      // Listen for messages from the other peer
      connection.on("data", receiveMessage);

      // Listen for the connection close event
      connection.on("close", () => {
        console.log("Connection closed");
        setConnect(false);
      });
    });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-purple-600 text-white py-4 px-6 shadow">
        <h1 className="text-2xl font-bold text-center tracking-wide">🧊 3D Object Controller</h1>
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

          <Canvas className="w-full h-full" shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <Model rotation={rotationDeg} position={rotationPos} objectName={currentObject.query} colorEdit={colorEdit} />
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
  const gltf = useLoader(OBJLoader, `./${objectName}`);
  //const { camera, scene } = useThree();
  //const [selectedMaterial, setSelectedMaterial] = useState(null);

  const setRandomColor = (material: any) => {
    const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
    material.color.set(randomColor);
  };

  const traverseMaterials = (node: any) => {
    if (node.isMesh && node.material) {
      if (Array.isArray(node.material)) {
        //   console.log("array ", node.material);

        let selectedMaterial = node.material.find((material: any) => material.name === colorEdit?.name);
        const randomColor = new THREE.Color(colorEdit?.color);

        selectedMaterial?.color?.set(randomColor);
      } else if (node?.material?.name === colorEdit?.name) {
        //    console.log("alone ", node.material);

        const randomColor = new THREE.Color(colorEdit?.color);

        node.material?.color?.set(randomColor);
        // setRandomColor(node.material);
      } else {
        //console.log("else ", node.material.name, "clor ", color?.name);
      }
    }
    if (node.children) {
      node.children.forEach(traverseMaterials);
    }
    //   console.log("node koko");
  };

  // Track the previous rotation to detect changes
  const prevRotation = useRef([0, 0, 0]);

  useFrame(({ camera, scene }) => {
    camera.rotation.set(rotation[0], rotation[1], rotation[2]);
    camera.position.set(position[0], position[1], position[2]);

    // Check if the rotation has changed since the last frame

    // Traverse the scene and modify materials
    traverseMaterials(scene);
    prevRotation.current = rotation;
    //  prevColor.current =
  });

  return <primitive object={gltf} />;
};
