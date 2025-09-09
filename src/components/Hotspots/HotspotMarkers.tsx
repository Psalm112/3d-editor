import React from "react";
// import { Html } from "@react-three/drei";
import { useEditorStore } from "../../stores/editorStore";
import { HotspotMarker } from "./HotspotMarker";

export const HotspotMarkers: React.FC = () => {
  const hotspots = useEditorStore((state) => state.hotspots);

  return (
    <>
      {hotspots.map((hotspot) => (
        <HotspotMarker key={hotspot.id} hotspot={hotspot} />
      ))}
    </>
  );
};
