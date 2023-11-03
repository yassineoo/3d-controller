import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import QRCode from "qrcode";
//import Peer from "peerjs";

export default function IndexPage() {
  //const [peer, setPeer] = useState<Peer | null>(null);

  const [qrcode, setQrcode] = useState("");
  const [rotationDeg, setRotationDeg] = useState([0, 0, 0]);
  const [zoom, setZoom] = useState(5);
  // Function to send a "hello world" message

  // Function to receive a "hi" message
  const receiveHiMessage = (data: unknown) => {
    // console.log(data);
    const receivedValues = data as {
      zoom: number;
      rotation: { x: number; y: number; z: number };
    };
    console.log("data");
    console.log(data);
    console.log("receivedValues");
    console.log(receivedValues);
    console.log("receivedValues");
    const receivedRotationValues = receivedValues.rotation;
    setRotationDeg([
      receivedRotationValues.x,
      receivedRotationValues.y,
      receivedRotationValues.z,
    ]);
    setZoom(receivedValues.zoom);
    console.log("Received a 'hi' message!");
  };
  useEffect(() => {
    const Peer = require("peerjs").default;
    const peer = new Peer();
    console.log(peer);

    peer.on("open", () => {
      console.log("Peer ID:", peer.id);
      QRCode.toDataURL(
        `https://3d-controller-git-main-yassineoo.vercel.app/controller?id=${peer.id}`
      )
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
      connection.on("data", receiveHiMessage);
    });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <h1>Connect with WebRTC and QR Code</h1>
      <img className="h-40 w-40" src={qrcode} alt="QR code" />

      <Canvas
        className="flex-1 h-full"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, zoom], fov: 50 }}
      >
        <Suspense fallback={null}>
          <Model rotation={rotationDeg} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}

type ModelProps = {
  rotation: number[];
};

const Model = ({ rotation }: ModelProps) => {
  const gltf = useLoader(GLTFLoader, "./planet/scene.gltf");

  // Track the previous rotation to detect changes
  const prevRotation = useRef([0, 0, 0]);

  useFrame(({ camera, scene }) => {
    // camera.rotation.set(rotation[0], rotation[1], rotation[2]);
    scene.rotation.set(-rotation[0], -rotation[1], -rotation[2]);
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
      console.log(
        "Rotation (degrees):",
        rotation[0],
        rotation[1],
        rotation[2],
        roundedCurrentRotation
      );

      // Update the previous rotation
      prevRotation.current = [
        currentRotation.x,
        currentRotation.y,
        currentRotation.z,
      ];

      // Send the rotation values to the other peer
    }
  });

  return <primitive object={gltf.scene} />;
};
