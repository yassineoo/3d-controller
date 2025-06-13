"use client";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { useRouter } from "next/router";
import ColorPicker from "@/components/colorPicker";
import Model from "../modal";

const AVAILABLE_OBJECTS = [
  { name: "Desktop PC", query: "desktop_pc" },
  { name: "Planet", query: "planet" },
  { name: "Swim Villa", query: "swimvilla" },
];

export default function ConnectPage() {
  const [peer, setPeer] = useState<any>();
  const [peerId, setPeerId] = useState("");
  const [connection, setConnection] = useState<any>();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const [selectedMaterial, setSelectedMaterial] = useState<THREE.Material | null>(null);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(1); // Start with planet

  const router = useRouter();

  const currentObject = AVAILABLE_OBJECTS[currentObjectIndex];

  const connectToPeer = (id: string = "") => {
    console.log(`connecting ................`);

    if (!peer || (!peerId && !id)) {
      console.log("Peer or peerId is missing");
      return;
    }

    const newConnection = peer.connect(id ? id : peerId);
    newConnection.on("open", () => {
      setConnection(newConnection);
    });
  };

  const handleApplyColor = () => {
    if (selectedMaterial && "color" in selectedMaterial) {
      (selectedMaterial?.color as THREE.Color).set(color);
      setShowColorPicker(false);
    }
  };

  const handleColorChange = (newColor: any) => {
    if (selectedMaterial && "color" in selectedMaterial) {
      (selectedMaterial?.color as THREE.Color).set(newColor.hex);
    }
    setColor(newColor.hex);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
  };

  const switchObject = (direction: "next" | "prev") => {
    // Update local object index
    if (direction === "next") {
      setCurrentObjectIndex((prev) => (prev + 1) % AVAILABLE_OBJECTS.length);
    } else {
      setCurrentObjectIndex((prev) => (prev - 1 + AVAILABLE_OBJECTS.length) % AVAILABLE_OBJECTS.length);
    }

    // Send object switch command to main display
    if (connection) {
      connection.send({
        objectSwitch: direction,
      });
    }
  };

  const handleVisibilityChange = (connection: any) => {
    if (false) {
      // Keep the original logic but disabled
      console.log("Page is hidden");
      if (connection) {
        console.log("Page is closed");
        connection.close();
        setConnection(null);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const Peer = require("peerjs").default;
    const peer = new Peer();

    setPeer(peer);

    const url = new URL(window.location.href);
    const hasIdQueryParameter = url.searchParams.has("id");

    if (hasIdQueryParameter) {
      const peerIdFromUrl = url.searchParams.get("id");
      if (peerIdFromUrl) {
        setPeerId(peerIdFromUrl);
      }
    }

    return () => {
      peer.destroy();
    };
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", () => handleVisibilityChange(connection));
  }, [connection]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-3">
        <h1 className="font-bold text-lg text-center">3D Object Controller</h1>
      </header>

      {/* Connection Status */}
      {connection ? (
        <div className="bg-green-100 p-3 text-center">
          <p className="text-green-800 font-semibold">✓ Connected Successfully</p>
          {showColorPicker && <ColorPicker color={color} onChange={handleColorChange} onClose={handleColorPickerClose} onApply={handleApplyColor} />}
        </div>
      ) : (
        <div className="bg-yellow-100 p-3 text-center">
          <p className="text-yellow-800 mb-3">Not Connected</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            onClick={() => connectToPeer()}
          >
            Connect to Display
          </button>
        </div>
      )}

      {/* Object Controls */}
      {connection && (
        <div className="bg-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Current Object:</h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{currentObject.name}</span>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => switchObject("prev")}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              ← Previous Object
            </button>
            <button
              onClick={() => switchObject("next")}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              Next Object →
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas className="flex-1 h-full" shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <OrbitControls enableRotate={true} />
        <Suspense fallback={null}>
          <Model
            rotation={[3, 2, 0]}
            connection={connection}
            objectName={currentObject.query}
            setSelectedMaterial={setSelectedMaterial}
            selectedMaterial={selectedMaterial}
            setShowColorPicker={setShowColorPicker}
            color={color}
            setColor={setColor}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
