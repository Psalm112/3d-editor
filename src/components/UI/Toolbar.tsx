import React from "react";
import { Plus, RotateCcw, Eye, EyeOff, MapPin } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";

export const Toolbar: React.FC = () => {
  const {
    model,
    isAddingHotspot,
    setIsAddingHotspot,
    clearScene,
    hotspots,
    hotspotsVisible,
    toggleHotspotsVisibility,
    removeHotspot,
    selectedHotspot,
    setSelectedHotspot,
  } = useEditorStore();

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
        padding: "16px",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: "240px",
        maxWidth: "280px",
      }}
    >
      <h3
        style={{
          margin: "0 0 8px 0",
          fontSize: "18px",
          fontWeight: "700",
          color: "#2c3e50",
        }}
      >
        SwiftXR Mini Editor
      </h3>

      {hasModel && (
        <>
          {/* Hotspot Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setIsAddingHotspot(!isAddingHotspot)}
                disabled={!hasModel}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: isAddingHotspot ? "#ff6b6b" : "#4dabf7",
                  color: "white",
                  cursor: hasModel ? "pointer" : "not-allowed",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s",
                  opacity: hasModel ? 1 : 0.5,
                  flex: 1,
                }}
              >
                <Plus size={16} />
                {isAddingHotspot ? "Cancel" : "Add Hotspot"}
              </button>

              <button
                onClick={toggleHotspotsVisibility}
                disabled={hotspots.length === 0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px",
                  border: "1px solid #6c757d",
                  borderRadius: "8px",
                  backgroundColor: hotspotsVisible ? "#28a745" : "#6c757d",
                  color: "white",
                  cursor: hotspots.length > 0 ? "pointer" : "not-allowed",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s",
                  opacity: hotspots.length > 0 ? 1 : 0.5,
                }}
                title={
                  hotspotsVisible ? "Hide all hotspots" : "Show all hotspots"
                }
              >
                {hotspotsVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            {isAddingHotspot && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#4dabf7",
                  padding: "8px 12px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "6px",
                  fontWeight: "500",
                }}
              >
                <MapPin
                  size={14}
                  style={{ display: "inline", marginRight: "6px" }}
                />
                Click on the model to place a hotspot
              </div>
            )}
          </div>

          {/* Hotspots List */}
          {hotspots.length > 0 && (
            <div
              style={{
                borderTop: "1px solid #e9ecef",
                paddingTop: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <MapPin size={16} />
                Hotspots ({hotspots.length})
              </div>

              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {hotspots.map((hotspot, index) => (
                  <div
                    key={hotspot.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      backgroundColor:
                        selectedHotspot === hotspot.id ? "#fff3cd" : "#f8f9fa",
                      border:
                        selectedHotspot === hotspot.id
                          ? "1px solid #ffc107"
                          : "1px solid #e9ecef",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onClick={() =>
                      setSelectedHotspot(
                        selectedHotspot === hotspot.id ? null : hotspot.id
                      )
                    }
                  >
                    <div
                      style={{ flex: 1, fontWeight: "500", color: "#495057" }}
                    >
                      {hotspot.label}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHotspot(hotspot.id);
                      }}
                      style={{
                        background: "#dc3545",
                        border: "none",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                      title="Delete hotspot"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clear Scene Button */}
          <button
            onClick={clearScene}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              border: "1px solid #dc3545",
              borderRadius: "8px",
              backgroundColor: "transparent",
              color: "#dc3545",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s",
              marginTop: "8px",
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
        </>
      )}
    </div>
  );
};
