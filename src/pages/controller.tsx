"use client";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";
import { useRouter } from "next/router";
import ColorPicker from "@/components/colorPicker";
const AVAILABLE_OBJECTS = [
  { name: "Beko01", query: "./MAX-LVM1637FDIV-DI.glb" },
  { name: "Beko02", query: "./MAX-RDNH750AID.glb" },
  { name: "Beko03", query: "./MAX-RFNH640AIG.glb" },
  { name: "Beko04", query: "./MAX-WMFL1214DSNC-IV.glb" },
];

export default function ConnectPage() {
  const [peer, setPeer] = useState<any>();
  const [peerId, setPeerId] = useState("");
  const [connection, setConnection] = useState<any>();
  //const [showColorPicker, setShowColorPicker] = useState(false);
  //const [color, setColor] = useState("#ffffff");
  const [selectedMaterial, setSelectedMaterial] = useState<THREE.Material | null>(null);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0); // Start with planet

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
      //     (selectedMaterial?.color as THREE.Color).set(color);
      //  setShowColorPicker(false);
    }
  };

  const handleColorChange = (newColor: any) => {
    if (selectedMaterial && "color" in selectedMaterial) {
      (selectedMaterial?.color as THREE.Color).set(newColor.hex);
    }
    //setColor(newColor.hex);
  };

  const handleColorPickerClose = () => {
    // setShowColorPicker(false);
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-purple-600 text-white py-4 px-6 shadow">
        <h1 className="text-2xl font-bold text-center tracking-wide">🧊 3D Object Controller</h1>
      </header>

      {/* Connection & Object Controls */}
      <div className="w-full px-4 sm:px-6 mt-4">
        {!connection ? (
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 shadow-sm">
            <p className="text-yellow-800 text-sm font-medium">⚠️ Not Connected</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold h-9 px-4 rounded-md transition-all"
              onClick={() => connectToPeer()}
            >
              Connect to Display
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white border rounded-lg px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">🧩 Object:</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-xs font-medium">{currentObject.name}</span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => switchObject("prev")}
                className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white h-9 px-3 text-sm font-medium rounded-md transition"
              >
                ← Prev
              </button>
              <button
                onClick={() => switchObject("next")}
                className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white h-9 px-3 text-sm font-medium rounded-md transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 mt-4">
        <Canvas className="w-full h-full" shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
          <OrbitControls enableRotate={true} />
          <Suspense fallback={null}>
            {/* Bright ambient light to illuminate all sides equally */}
            <ambientLight intensity={1.5} />

            {/* Multiple directional lights from different angles */}
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} />
            <directionalLight position={[5, -5, -5]} intensity={0.8} />
            <directionalLight position={[-5, -5, 5]} intensity={0.8} />
            <Model
              rotation={[3, 2, 0]}
              connection={connection}
              objectName={currentObject.query}
              setSelectedMaterial={setSelectedMaterial}
              selectedMaterial={selectedMaterial}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
const Model = ({ rotation, connection, objectName, setSelectedMaterial, selectedMaterial, setShowColorPicker, setColor, color }: any) => {
  const gltf = useLoader(GLTFLoader, `${objectName}`);
  const { camera, scene } = useThree(); // Assuming you have access to useThree

  // Track the previous rotation and position to detect changes
  const prevRotation = useRef([0, 0, 0]);
  const prevPosition = useRef([0, 0, 0]);

  const traverseMaterials = (node: any) => {
    if (node.isMesh && node.material) {
      if (Array.isArray(node.material)) {
        node.material.forEach((material: any) => {
          // setRandomColor(material);
          material.userData = { onClick: () => setSelectedMaterial(material) };
          material.transparent = true;
        });
      } else {
        // setRandomColor(node.material);
        node.material.userData = {
          onClick: () => setSelectedMaterial(node.material),
        };
        node.material.transparent = true;
      }
    }
    if (node.children) {
      node.children.forEach(traverseMaterials);
    }
  };

  const handleClick = (event: any) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      let clickedMaterial: THREE.Material | null = null;
      if ("material" in clickedObject) {
        clickedMaterial = clickedObject.material as THREE.Material;
      }
      if (clickedMaterial && clickedMaterial?.userData && clickedMaterial?.userData?.onClick) {
        clickedMaterial.userData.onClick();
        // console.log("clickedMaterial ", clickedMaterial.name);

        setSelectedMaterial(clickedMaterial);
        //  setShowColorPicker(true);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [scene]);

  useFrame(() => {
    const currentRotation = {
      x: camera.rotation.x,
      y: camera.rotation.y,
      z: camera.rotation.z,
    };

    const currentPosition = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };

    const roundedCurrentRotation = {
      x: Number(currentRotation.x.toFixed(4)),
      y: Number(currentRotation.y.toFixed(4)),
      z: Number(currentRotation.z.toFixed(4)),
    };

    const roundedCurrentPosition = {
      x: Number(currentPosition.x.toFixed(4)),
      y: Number(currentPosition.y.toFixed(4)),
      z: Number(currentPosition.z.toFixed(4)),
    };

    if (
      roundedCurrentRotation.x !== Number(prevRotation.current[0].toFixed(4)) ||
      roundedCurrentRotation.y !== Number(prevRotation.current[1].toFixed(4)) ||
      roundedCurrentRotation.z !== Number(prevRotation.current[2].toFixed(4)) ||
      roundedCurrentPosition.x !== Number(prevRotation.current[0].toFixed(4)) ||
      roundedCurrentPosition.y !== Number(prevRotation.current[1].toFixed(4)) ||
      roundedCurrentPosition.z !== Number(prevRotation.current[2].toFixed(4))
    ) {
      prevRotation.current = [currentRotation.x, currentRotation.y, currentRotation.z];
      prevPosition.current = [currentPosition.x, currentPosition.y, currentPosition.z];

      connection?.send({
        rotation: roundedCurrentRotation,
        position: currentPosition,
        colorEdit: {
          color: color,
          name: selectedMaterial ? selectedMaterial.name : null,
        },
      });
    }

    // Update material transparency based on selection
    if (selectedMaterial) {
      selectedMaterial.opacity = 0.5; // You can adjust the opacity as needed
    }
  });

  useEffect(() => {
    traverseMaterials(scene);
  }, [scene]); // Ensure materials are traversed when the scene changes

  return <primitive object={gltf.scene} />;
};
