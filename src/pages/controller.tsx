"use client";
//import * as Peer from "peerjs";
import * as qrcodeReader from "qrcode-reader";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default function ConnectPage() {
  const [peer, setPeer] = useState<any>();
  const [peerId, setPeerId] = useState("");
  const [connection, setConnection] = useState<any>();

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

  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Page is hidden (user switched to another app or clicked home button)
      // Disconnect the existing connection
      if (connection) {
        connection.close();
        setConnection(null);
      }
    }
  };

  useEffect(() => {
    // Add event listener for visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

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

  return (
    <div className="h-screen flex flex-col">
      {connection ? (
        <div>
          <p>Connected to peer: {peerId}</p>
          {/* Add your communication logic here */}
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
          <Model rotation={[3, 2, 0]} connection={connection} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

type ModelProps = {
  rotation: [number, number, number];
  connection: any;
};

const Model = ({ rotation, connection }: ModelProps) => {
  const gltf = useLoader(GLTFLoader, "./planet/scene.gltf");

  // Track the previous rotation to detect changes
  const prevRotation = useRef([0, 0, 0]);
  const prevPosition = useRef([0, 0, 0]);

  useFrame(({ camera, scene }) => {
    // Extract the rotation in degrees
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
    // const currentZoom = camera.position.z.toFixed(4); // Get the zoom value

    // Check if the rotation has changed since the last frame
    if (
      roundedCurrentRotation.x !== Number(prevRotation.current[0].toFixed(4)) ||
      roundedCurrentRotation.y !== Number(prevRotation.current[1].toFixed(4)) ||
      roundedCurrentRotation.z !== Number(prevRotation.current[2].toFixed(4)) ||
      roundedCurrentPosition.x !== Number(prevRotation.current[0].toFixed(4)) ||
      roundedCurrentPosition.y !== Number(prevRotation.current[1].toFixed(4)) ||
      roundedCurrentPosition.z !== Number(prevRotation.current[2].toFixed(4))
    ) {
      // Log the new rotation values
      //  console.log("Rotation (degrees):", roundedCurrentRotation);

      // Update the previous rotation
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
      // setPrevZoom(camera.position.z);
      // console.log("zoom is ", currentPosition);

      //console.log("zoom is ", scene.position);

      // Send the rotation values to the other peer
      //connection?.send(roundedCurrentRotation);
      connection?.send({
        rotation: roundedCurrentRotation,
        position: currentPosition,
        // zoom: currentZoom,
      });
    }
  });

  return <primitive object={gltf.scene} />;
};
