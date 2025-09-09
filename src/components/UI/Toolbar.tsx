import React from "react";
import { Plus, RotateCcw } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";

export const Toolbar: React.FC = () => {
  const { model, isAddingHotspot, setIsAddingHotspot, clearScene, hotspots } =
    useEditorStore();

  const hasModel = !!model;

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 100,
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "12px",
        padding: "12px",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: "200px",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>
        SwiftXR Mini Editor
      </h3>

      {hasModel && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => setIsAddingHotspot(!isAddingHotspot)}
            disabled={!hasModel}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: isAddingHotspot ? "#ff6b6b" : "#4dabf7",
              color: "white",
              cursor: hasModel ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background-color 0.2s",
              opacity: hasModel ? 1 : 0.5,
            }}
          >
            <Plus size={16} />
            {isAddingHotspot ? "Cancel Hotspot" : "Add Hotspot"}
          </button>

          <div
            style={{
              fontSize: "12px",
              color: "#6c757d",
              padding: "8px 0",
              borderTop: "1px solid #e9ecef",
            }}
          >
            Hotspots: {hotspots.length}
            {isAddingHotspot && (
              <div style={{ marginTop: "4px", fontStyle: "italic" }}>
                Click on the model to place a hotspot
              </div>
            )}
          </div>

          <button
            onClick={clearScene}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              border: "1px solid #dc3545",
              borderRadius: "8px",
              backgroundColor: "transparent",
              color: "#dc3545",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#dc3545";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#dc3545";
            }}
          >
            <RotateCcw size={16} />
            Clear Scene
          </button>
        </div>
      )}
    </div>
  );
};
