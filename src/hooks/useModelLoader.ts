import { useCallback } from "react";
// import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { useEditorStore } from "../stores/editorStore";

export const useModelLoader = () => {
  const setModel = useEditorStore((state) => state.setModel);
  const clearScene = useEditorStore((state) => state.clearScene);

  const loadModel = useCallback(
    async (file: File) => {
      return new Promise<THREE.Group>((resolve, reject) => {
        const loader = new GLTFLoader();
        const reader = new FileReader();

        reader.onload = (event) => {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          loader.parse(
            arrayBuffer,
            "",
            (gltf) => {
              const model = gltf.scene;

              // Center and scale the model
              const box = new THREE.Box3().setFromObject(model);
              const center = box.getCenter(new THREE.Vector3());
              const size = box.getSize(new THREE.Vector3());
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = 2 / maxDim;

              model.scale.setScalar(scale);
              model.position.sub(center.multiplyScalar(scale));

              // Ensure all materials are properly configured
              model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  if (child.material) {
                    child.material.needsUpdate = true;
                  }
                }
              });

              setModel(model);
              resolve(model);
            },
            (error) => {
              console.error("Error loading model:", error);
              reject(error);
            }
          );
        };

        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file);
      });
    },
    [setModel]
  );

  return { loadModel, clearScene };
};
