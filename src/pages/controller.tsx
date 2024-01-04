"use client";
//import * as Peer from "peerjs";
import * as qrcodeReader from "qrcode-reader";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { useRouter } from "next/router";
import ColorPicker from "@/components/colorPicker";

export default function ConnectPage() {
  const [peer, setPeer] = useState<any>();
  const [peerId, setPeerId] = useState("");
  const [connection, setConnection] = useState<any>();

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState("#ffffff");

  const [selectedMaterial, setSelectedMaterial] =
    useState<THREE.Material | null>(null);

  const router = useRouter();
  const url = router.asPath;

  // Parse the URL
  console.log(url);

  // Split on '?' to get query string
  const queryString = url?.split("?")[1];
  console.log(queryString);

  // Split on '&' to get component= part
  const componentQuery = queryString?.split("&")[0];
  console.log(componentQuery);

  // Split on '=' and take first element
  const objectName = componentQuery?.split("=")[1] || "planet";

  console.log(objectName);

  const connectToPeer = (id: string = "") => {
    console.log(`connecting ................`);
    console.log(`peer`);

    console.log(peer);
    console.log(peerId);
    console.log(`peerId`);

    if (!peer || (!peerId && !id)) {
      console.log("Peer or peerId is missing");
      return;
    }

    const newConnection = peer.connect(id ? id : peerId);
    newConnection.on("open", () => {
      // Connection established, you can use `newConnection` for data transfer
      setConnection(newConnection);
      // newConnection?.send("hi");
    });
  };

  const handleApplyColor = () => {
    if (selectedMaterial && "color" in selectedMaterial) {
      // Update the color of the selected material
      (selectedMaterial?.color as THREE.Color).set(color);
      setShowColorPicker(false);
    }
  };

  const handleColorChange = (newColor: any) => {
    // Update the color of the selected material
    if (selectedMaterial && "color" in selectedMaterial) {
      // Update the color of the selected material
      (selectedMaterial?.color as THREE.Color).set(newColor.hex);
    }
    setColor(newColor.hex);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
  };

  const handleVisibilityChange = (connection: any) => {
    //if (document.hidden) {
    if (false) {
      console.log("Page is hidden");

      // Page is hidden (user switched to another app or clicked home button)
      // Disconnect the existing connection
      if (connection) {
        console.log("Page is closed");

        connection.close();
        setConnection(null);
      }
    }
  };

  useEffect(() => {
    //console.log("selectedMaterial ", selectedMaterial);
  }, [selectedMaterial]);

  useEffect(() => {
    // Add event listener for visibility change
    //document.addEventListener("visibilitychange", handleVisibilityChange);

    const Peer = require("peerjs").default;
    const peer = new Peer();

    setPeer(peer);
    console.log(peer);
    // Get the current URL
    const url = new URL(window.location.href);

    // Check if the URL contains the ID as a query parameter
    const hasIdQueryParameter = url.searchParams.has("id");
    console.log("id is ", hasIdQueryParameter);

    // If the URL contains the ID as a query parameter, connect directly to the peer
    if (hasIdQueryParameter) {
      const peerIdFromUrl = url.searchParams.get("id");

      console.log("Real id is ", peerIdFromUrl);

      if (peerIdFromUrl) {
        setPeerId(peerIdFromUrl);
        console.log("i have put this as input ", peerIdFromUrl);
        console.log("after setup the peer id in the state : ", peerId);
        //  connectToPeer(peerIdFromUrl);
      }
    }

    return () => {
      // Clean up resources when the component unmounts
      peer.destroy();
    };
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", () =>
      handleVisibilityChange(connection)
    );
  }, [connection]);
  return (
    <div className="h-screen flex flex-col">
      {connection ? (
        <div>
          <p>Connected to peer: {peerId}</p>
          {/* Add your communication logic here */}
          {showColorPicker && (
            <ColorPicker
              color={color}
              onChange={handleColorChange}
              onClose={handleColorPickerClose}
              onApply={handleApplyColor}
            />
          )}
        </div>
      ) : (
        <div className=" flex justify-center items-center mt-4">
          <button
            className=" bg-gray-500 text-center  cursor-pointer text-white pb-10 rounded-lg "
            onClick={() => {
              connectToPeer();
            }}
          >
            Click to Connect
          </button>
        </div>
      )}
      <Canvas
        className="flex-1 h-full"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <OrbitControls enableRotate={true} />
        <Suspense fallback={null}>
          <Model
            rotation={[3, 2, 0]}
            connection={connection}
            objectName={objectName}
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

const Model = ({
  rotation,
  connection,
  objectName,
  setSelectedMaterial,
  selectedMaterial,
  setShowColorPicker,
  setColor,
  color,
}: any) => {
  const gltf = useLoader(GLTFLoader, `./${objectName}/scene.gltf`);
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
      if (
        clickedMaterial &&
        clickedMaterial?.userData &&
        clickedMaterial?.userData?.onClick
      ) {
        clickedMaterial.userData.onClick();
        // console.log("clickedMaterial ", clickedMaterial.name);

        setSelectedMaterial(clickedMaterial);
        setShowColorPicker(true);
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
      prevRotation.current = [
        currentRotation.x,
        currentRotation.y,
        currentRotation.z,
      ];
      prevPosition.current = [
        currentPosition.x,
        currentPosition.y,
        currentPosition.z,
      ];

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
