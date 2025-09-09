import React from "react";
import { useThree } from "@react-three/fiber";
import { useEditorStore } from "../../stores/editorStore";
import * as THREE from "three";

export const SceneInteractionHandler: React.FC = () => {
  const { raycaster, camera, gl } = useThree();
  const { model, isAddingHotspot, addHotspot, hotspots } = useEditorStore();

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

        // Generate a unique name
        const hotspotNumber = hotspots.length + 1;

        addHotspot({
          position: offsetPoint,
          label: `Hotspot ${hotspotNumber}`,
          description: "Click to edit this hotspot",
          visible: true,
        });
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isAddingHotspot) {
        useEditorStore.getState().setIsAddingHotspot(false);
      }
    };

    gl.domElement.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    gl.domElement.style.cursor = "crosshair";

    return () => {
      gl.domElement.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
      gl.domElement.style.cursor = "auto";
    };
  }, [
    isAddingHotspot,
    model,
    raycaster,
    camera,
    gl,
    addHotspot,
    hotspots.length,
  ]);

  return null;
};
