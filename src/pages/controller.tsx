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
  const qrCodeRef = useRef(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const reader = new qrcodeReader();

    try {
      if (file && file.type.startsWith("image/")) {
        const fileReader = new FileReader();

        fileReader.onload = async () => {
          const dataURL = fileReader.result as string;
          const img = new Image();
          console.log("dataURL");
          console.log(dataURL);
          console.log("dataURL");

          img.src = dataURL ?? "";
          console.log(img);

          img.onload = async () => {
            reader.callback = function (err: any, value: any) {
              if (err) {
                console.error(err);
              }
              // __ Printing the decrypted value __ \\

              console.log("value");
              console.log(value);
              setPeerId(value?.result);
            };
            // Decode the QR code

            const decodedQR = await reader.decode(dataURL);
          };
        };

        fileReader.readAsDataURL(file);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectToPeer = () => {
    console.log(peer);
    console.log(peerId);

    if (!peer || !peerId) {
      console.log("Peer or peerId is missing");
      return;
    }

    const newConnection = peer.connect(peerId);
    newConnection.on("open", () => {
      // Connection established, you can use `newConnection` for data transfer
      setConnection(newConnection);
      newConnection?.send("hi");
    });
  };
  useEffect(() => {
    const Peer = require("peerjs").default;
    const peer = new Peer();

    setPeer(peer);

    // Get the current URL
    const url = new URL(window.location.href);

    // Check if the URL contains the ID as a query parameter
    const hasIdQueryParameter = url.searchParams.has("id");

    // If the URL contains the ID as a query parameter, connect directly to the peer
    if (hasIdQueryParameter) {
      const peerIdFromUrl = url.searchParams.get("id");

      if (peerIdFromUrl) {
        setPeerId(peerIdFromUrl);
        connectToPeer();
      }
    }

    return () => {
      // Clean up resources when the component unmounts
      peer.destroy();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <h1>Connect with WebRTC by Scanning a QR Code</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div ref={qrCodeRef}></div> {/* Add a div to display the QR code */}
      {connection ? (
        <div>
          <p>Connected to peer: {peerId}</p>
          {/* Add your communication logic here */}
        </div>
      ) : (
        <button onClick={connectToPeer}>Connect to Peer</button>
      )}
      <Canvas
        className="flex-1 h-full"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 50 }}
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

  useFrame(({ camera, scene }) => {
    // Extract the rotation in degrees
    const currentRotation = {
      x: camera.rotation.x,
      y: camera.rotation.y,
      z: camera.rotation.z,
    };

    const roundedCurrentRotation = {
      x: Number(currentRotation.x.toFixed(2)),
      y: Number(currentRotation.y.toFixed(2)),
      z: Number(currentRotation.z.toFixed(2)),
    };

    // Check if the rotation has changed since the last frame
    if (
      roundedCurrentRotation.x !== Number(prevRotation.current[0].toFixed(2)) ||
      roundedCurrentRotation.y !== Number(prevRotation.current[1].toFixed(2)) ||
      roundedCurrentRotation.z !== Number(prevRotation.current[2].toFixed(2))
    ) {
      // Log the new rotation values
      console.log("Rotation (degrees):", roundedCurrentRotation);

      // Update the previous rotation
      prevRotation.current = [
        currentRotation.x,
        currentRotation.y,
        currentRotation.z,
      ];

      // Send the rotation values to the other peer
      connection?.send(roundedCurrentRotation);
    }
  });

  return <primitive object={gltf.scene} />;
};
