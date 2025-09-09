import React from "react";
import { Scene } from "./components/Scene/Scene";
import { FileUploader } from "./components/UI/FileUploader";
import { Toolbar } from "./components/UI/Toolbar";
import { useEditorStore } from "./stores/editorStore";
import "./App.css";

const App: React.FC = () => {
  const model = useEditorStore((state) => state.model);

  return (
    <div className="app">
      <div className="main-container">
        {model ? (
          <>
            <Scene showStats={false} showGrid={true} />
            <Toolbar />
          </>
        ) : (
          <div className="upload-container">
            <div className="upload-wrapper">
              <h1>SwiftXR Mini Editor</h1>
              <p>Import a 3D model to get started</p>
              <FileUploader />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
