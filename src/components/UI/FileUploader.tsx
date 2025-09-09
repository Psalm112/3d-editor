import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { useModelLoader } from "../../hooks/useModelLoader";

export const FileUploader: React.FC = () => {
  const { loadModel } = useModelLoader();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          await loadModel(file);
        } catch (error) {
          console.error("Failed to load model:", error);
          alert("Failed to load the 3D model. Please check the file format.");
        }
      }
    },
    [loadModel]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "model/gltf-binary": [".glb"],
      "model/gltf+json": [".gltf"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #ccc",
        borderRadius: "8px",
        padding: "40px",
        textAlign: "center",
        cursor: "pointer",
        transition: "border-color 0.3s ease",
        backgroundColor: isDragActive ? "#f0f9ff" : "transparent",
        borderColor: isDragActive ? "#4dabf7" : "#ccc",
      }}
    >
      <input {...getInputProps()} />
      <Upload size={48} color="#6c757d" style={{ margin: "0 auto 16px" }} />
      <p style={{ color: "#6c757d", margin: "0" }}>
        {isDragActive
          ? "Drop the GLB file here..."
          : "Drag & drop a GLB file here, or click to select"}
      </p>
      <p style={{ color: "#adb5bd", fontSize: "14px", margin: "8px 0 0" }}>
        Supports .glb and .gltf files
      </p>
    </div>
  );
};
