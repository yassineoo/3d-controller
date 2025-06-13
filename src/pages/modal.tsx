import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const Model = ({ rotation, connection, objectName = "planet", setSelectedMaterial, selectedMaterial, setShowColorPicker, setColor, color }: any) => {
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
      if (clickedMaterial && clickedMaterial?.userData && clickedMaterial?.userData?.onClick) {
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

export default Model;
