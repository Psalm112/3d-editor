import React from "react";
import { useEditorStore } from "../../stores/editorStore";
// import * as THREE from "three";

export const Model: React.FC = () => {
  const model = useEditorStore((state) => state.model);

  if (!model) return null;

  return <primitive object={model} />;
};
