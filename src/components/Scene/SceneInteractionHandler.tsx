import React from "react";
import { useThree } from "@react-three/fiber";
import { useEditorStore } from "../../stores/editorStore";
import * as THREE from "three";

export const SceneInteractionHandler: React.FC = () => {
  const { raycaster, camera, gl } = useThree();
  const { model, isAddingHotspot, addHotspot } = useEditorStore();

  React.useEffect(() => {
    if (!isAddingHotspot) return;

    const handleClick = (event: MouseEvent) => {
      if (!model) return;

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(model, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const normal = intersects[0].face?.normal || new THREE.Vector3(0, 1, 0);

        // Offset the hotspot slightly from the surface
        const offsetPoint = point
          .clone()
          .add(normal.clone().multiplyScalar(0.1));

        addHotspot({
          position: offsetPoint,
          label: `Hotspot ${Date.now()}`,
          description: "Click to edit this hotspot",
          visible: true,
        });
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    gl.domElement.style.cursor = "crosshair";

    return () => {
      gl.domElement.removeEventListener("click", handleClick);
      gl.domElement.style.cursor = "auto";
    };
  }, [isAddingHotspot, model, raycaster, camera, gl, addHotspot]);

  return null;
};
