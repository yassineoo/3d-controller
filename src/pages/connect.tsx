import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import QRCode from "qrcode";
import { useRouter } from "next/router";
//import Peer from "peerjs";

export default function IndexPage() {
  //const [peer, setPeer] = useState<Peer | null>(null);
  const router = useRouter();
  const routePath = router.asPath;
  const objectName = routePath.split("=")[1] || "planet";

  const [qrcode, setQrcode] = useState("");
  const [connect, setConnect] = useState(false);
  const [rotationDeg, setRotationDeg] = useState([0, 0, 0]);
  const [rotationPos, setRotationPos] = useState([
    0, 0, 5,
    // 3.3981969110497063, 0, -1.8340472463730382,
  ]);
  //  const [zoom, setZoom] = useState(5);
  // Function to send a "hello world" message

  // Function to receive a "hi" message
  const receiveHiMessage = (data: unknown) => {
    // console.log(data);
    console.log(data);

    if (!connect) setConnect(true);
    const receivedValues = data as {
      //  zoom: number;
      rotation: { x: number; y: number; z: number };
      position: { x: number; y: number; z: number };
    };

    const receivedRotationValues = receivedValues.rotation;
    setRotationDeg([
      receivedRotationValues.x,
      receivedRotationValues.y,
      receivedRotationValues.z,
    ]);

    setRotationPos([
      receivedValues.position.x,
      receivedValues.position.y,
      receivedValues.position.z,
    ]);
    // console.log("position ", receivedValues.position);

    //console.log("Received a 'hi' message!");
  };
  useEffect(() => {
    const Peer = require("peerjs").default;
    const peer = new Peer();
    console.log(peer);

    peer.on("open", () => {
      console.log("Peer ID:", peer.id);
      const url = `${window.location.origin}/controller?component=${objectName}&id=${peer.id}`;
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
      connection.on("data", receiveHiMessage);

      // Listen for the connection close event
      connection.on("close", () => {
        console.log("Connection closed");
        setConnect(false);
      });
    });
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      {!connect && (
          <h1 className="my-16">Connect with you phone to controle </h1>
        ) && <img className=" w-1/6" src={qrcode} alt="QR code" />}
      {connect && (
        <Canvas
          className="flex-1 h-full"
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0, 5], fov: 50 }}
        >
          <Suspense fallback={null}>
            <Model
              rotation={rotationDeg}
              position={rotationPos}
              objectName={objectName}
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

type ModelProps = {
  rotation: number[];
  position: number[];
  objectName: string;
};

const Model = ({ rotation, position, objectName }: ModelProps) => {
  const gltf = useLoader(GLTFLoader, `./${objectName}/scene.gltf`);

  // Track the previous rotation to detect changes
  const prevRotation = useRef([0, 0, 0]);

  useFrame(({ camera, scene }) => {
    // camera.rotation.set(rotation[0], rotation[1], rotation[2]);
    camera.rotation.set(rotation[0], rotation[1], rotation[2]);
    camera.position.set(position[0], position[1], position[2]);
    //console.log("pso", camera.position.x, camera.position.y, camera.position.z);
    //  console.log(camera.rotation.x, camera.rotation.y, camera.rotation.z);

    // camera.position.z = zoom;
    // Check if the rotation has changed since the last frame
  });

  return <primitive object={gltf.scene} />;
};
