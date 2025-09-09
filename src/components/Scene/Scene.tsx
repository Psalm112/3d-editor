import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Stats } from "@react-three/drei";
import { Model } from "./Model";
import { HotspotMarkers } from "../Hotspots/HotspotMarkers";
import { SceneInteractionHandler } from "./SceneInteractionHandler";

interface SceneProps {
  showStats?: boolean;
  showGrid?: boolean;
}

export const Scene: React.FC<SceneProps> = ({
  showStats = false,
  showGrid = true,
}) => {
  const controlsRef = useRef<any>(null);

  return (
    <div className="scene-container" style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.warn("WebGL context lost. Attempting to recover...");
          });

          gl.domElement.addEventListener("webglcontextrestored", () => {
            console.log("WebGL context restored");
          });
        }}
      >
        {showStats && <Stats />}

        {/* Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
          minDistance={1}
          maxDistance={100}
          maxPolarAngle={Math.PI / 1.8}
        />

        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />

        <color attach="background" args={["#f0f0f0"]} />

        {/* Grid */}
        {showGrid && (
          <Grid
            renderOrder={-1}
            position={[0, -0.01, 0]}
            infiniteGrid
            cellSize={0.6}
            cellThickness={0.6}
            sectionSize={3.3}
            sectionThickness={1.5}
            sectionColor="#8080ff"
            fadeDistance={30}
          />
        )}

        {/* Scene Content */}
        <Suspense fallback={null}>
          <Model />
          <HotspotMarkers />
          <SceneInteractionHandler />
        </Suspense>
      </Canvas>
    </div>
  );
};
