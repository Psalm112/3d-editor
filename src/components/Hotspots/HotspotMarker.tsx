import React, { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEditorStore } from "../../stores/editorStore";
import type { Hotspot } from "../../types";
import * as THREE from "three";

interface HotspotMarkerProps {
  hotspot: Hotspot;
}

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { selectedHotspot, setSelectedHotspot, updateHotspot, removeHotspot } =
    useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(hotspot.label);

  const isSelected = selectedHotspot === hotspot.id;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.lookAt(state.camera.position);
      meshRef.current.scale.setScalar(hovered || isSelected ? 1.2 : 1);
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHotspot(isSelected ? null : hotspot.id);
  };

  const handleSaveEdit = () => {
    updateHotspot(hotspot.id, { label: editLabel });
    setIsEditing(false);
  };

  const handleDelete = () => {
    removeHotspot(hotspot.id);
  };

  if (!hotspot.visible) return null;

  return (
    <group position={hotspot.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial
          color={isSelected ? "#ff6b6b" : hovered ? "#4ecdc4" : "#4dabf7"}
          transparent
          opacity={0.8}
        />
      </mesh>

      <Html
        center
        distanceFactor={10}
        position={[0, 0.2, 0]}
        style={{
          pointerEvents: "auto",
          userSelect: "none",
        }}
      >
        <div
          className={`hotspot-label ${isSelected ? "selected" : ""}`}
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            whiteSpace: "nowrap",
            border: isSelected ? "2px solid #ff6b6b" : "2px solid transparent",
            minWidth: "120px",
            textAlign: "center",
          }}
        >
          {isEditing ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                style={{
                  background: "transparent",
                  border: "1px solid #ccc",
                  color: "white",
                  padding: "4px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
                autoFocus
              />
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={handleSaveEdit}
                  style={{
                    background: "#4ecdc4",
                    border: "none",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    background: "#6c757d",
                    border: "none",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div>{hotspot.label}</div>
              {isSelected && (
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    justifyContent: "center",
                    marginTop: "8px",
                  }}
                >
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: "#4dabf7",
                      border: "none",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      background: "#ff6b6b",
                      border: "none",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
