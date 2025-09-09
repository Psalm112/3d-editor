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
  const {
    selectedHotspot,
    setSelectedHotspot,
    updateHotspot,
    removeHotspot,
    hotspotsVisible,
  } = useEditorStore();
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
    if (editLabel.trim()) {
      updateHotspot(hotspot.id, { label: editLabel.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditLabel(hotspot.label);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeHotspot(hotspot.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  if (!hotspot.visible || !hotspotsVisible) return null;

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
          opacity={0.9}
        />

        <mesh>
          <ringGeometry args={[0.06, 0.08, 16]} />
          <meshBasicMaterial
            color={isSelected ? "#ff6b6b" : hovered ? "#4ecdc4" : "#4dabf7"}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </mesh>

      <Html
        center
        distanceFactor={10}
        position={[0, 0.15, 0]}
        style={{
          pointerEvents: "auto",
          userSelect: "none",
        }}
      >
        <div
          className={`hotspot-label ${isSelected ? "selected" : ""}`}
          style={{
            background: "rgba(0, 0, 0, 0.85)",
            color: "white",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "500",
            whiteSpace: "nowrap",
            border: isSelected ? "2px solid #ff6b6b" : "2px solid transparent",
            minWidth: "140px",
            textAlign: "center",
            backdropFilter: "blur(4px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          {isEditing ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                onKeyDown={handleKeyPress}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  outline: "none",
                  width: "100%",
                }}
                placeholder="Enter hotspot name"
                autoFocus
                maxLength={50}
              />
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={handleSaveEdit}
                  disabled={!editLabel.trim()}
                  style={{
                    background: editLabel.trim() ? "#4ecdc4" : "#6c757d",
                    border: "none",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    cursor: editLabel.trim() ? "pointer" : "not-allowed",
                    fontWeight: "500",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    background: "#6c757d",
                    border: "none",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  fontWeight: "600",
                  marginBottom: isSelected ? "10px" : "0",
                }}
              >
                {hotspot.label}
              </div>
              {isSelected && (
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    style={{
                      background: "#4dabf7",
                      border: "none",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Rename
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      background: "#ff6b6b",
                      border: "none",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: "500",
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
