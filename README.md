# SwiftXR Mini Editor

A React-based 3D model editor that allows users to import GLB/GLTF files and create interactive hotspots for model annotation.

## Features

*   🎯 **GLB/GLTF Import** - Drag & drop or click to import 3D models
*   🔄 **Interactive 3D Scene** - Full orbit controls (rotate, pan, zoom)
*   📍 **Hotspot System** - Click-to-place interactive hotspots on models
*   ✏️ **Hotspot Management** - Rename, delete, and toggle visibility
*   📱 **Responsive Design** - Works on desktop and mobile devices
*   ⚡ **Performance Optimized** - Efficient rendering with Three.js

## Live Demo

[View Demo](https://swiftxr-mini-editor.vercel.app/)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Psalm112/3d-editor.git

# Navigate to project directory
cd 3d-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

*   **Import Model:** Drag & drop a GLB/GLTF file or click to select
*   **Navigate Scene:** Use mouse to rotate, pan, and zoom around the model
*   **Add Hotspots:** Click "Add Hotspot" button, then click on the model
*   **Manage Hotspots:** Rename, delete, or toggle visibility of hotspots
*   **Clear Scene:** Reset everything with the "Clear Scene" button

## Tech Stack

*   **React 18** - UI framework
*   **TypeScript** - Type safety
*   **Three.js** - 3D graphics
*   **@react-three/fiber** - React Three.js renderer
*   **@react-three/drei** - Three.js utilities
*   **Zustand** - State management
*   **Vite** - Build tool

---

## Code Architecture Deep Dive

Let me walk you through how I architected this solution to meet all the requirements efficiently:

### 🏗️ Project Structure Strategy

I organized the codebase using a feature-based architecture that promotes maintainability and scalability:

```
src/
├── components/
│   ├── Scene/           # 3D scene components
│   ├── Hotspots/        # Hotspot-related components
│   └── UI/              # User interface components
├── stores/              # State management
├── hooks/               # Custom React hooks
└── types/               # TypeScript definitions
```

This structure separates concerns clearly - UI logic, 3D scene logic, state management, and type definitions are all isolated.

### 🎯 State Management Philosophy

I chose Zustand over Redux/Context API for several strategic reasons:

```typescript
// stores/editorStore.ts
export const useEditorStore = create<EditorStore>((set, get) => ({
  // Centralised state for the entire editor
  model: null,
  hotspots: [],
  selectedHotspot: null,
  isAddingHotspot: false,
  hotspotsVisible: true,
  
  // Actions that modify state
  addHotspot: (hotspotData) => {
    // Smart hotspot creation with auto-generated IDs
    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...hotspotData,
    };
    // Immutable state updates
    set((state) => ({
      hotspots: [...state.hotspots, newHotspot],
      isAddingHotspot: false, // Auto-exit hotspot mode
    }));
  },
}));
```

**Why Zustand?**

*   Minimal boilerplate compared to Redux
*   TypeScript-first with excellent type inference
*   No providers needed - works seamlessly with React Three Fiber
*   Perfect for 3D applications where state needs to be accessed from both React and Three.js contexts

### 🎮 3D Scene Architecture

The scene is built using a compositional approach with React Three Fiber:

```typescript
// components/Scene/Scene.tsx
export const Scene: React.FC<SceneProps> = ({ showStats, showGrid }) => {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      {/* Lighting setup for optimal model visibility */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      
      {/* Controls with carefully tuned parameters */}
      <OrbitControls
        dampingFactor={0.05}
        screenSpacePanning={false}
        maxPolarAngle={Math.PI / 1.8} // Prevents camera going below ground
      />
      
      {/* Modular scene components */}
      <Suspense fallback={null}>
        <Model />
        <HotspotMarkers />
        <SceneInteractionHandler />
      </Suspense>
    </Canvas>
  );
};
```

**Key Design Decisions:**

*   **Suspense Boundaries:** Wrap async 3D content to prevent render blocking
*   **Optimized Lighting:** Three-point lighting setup for consistent model visibility
*   **Constraint Controls:** Limited polar angle to maintain user orientation
*   **Performance Settings:** High-performance WebGL context with context loss recovery

### 📍 Hotspot System Deep Dive

The hotspot system was the most complex requirement. Here's how I solved it:

#### 1. Intelligent Placement Algorithm

```typescript
// components/Scene/SceneInteractionHandler.tsx
const handleClick = (event: MouseEvent) => {
  // Convert mouse coordinates to 3D space
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(model, true);

  if (intersects.length > 0) {
    const point = intersects[0].point;
    const normal = intersects[0].face?.normal || new THREE.Vector3(0, 1, 0);
    
    // Smart positioning: offset from surface using surface normal
    const offsetPoint = point.clone().add(normal.clone().multiplyScalar(0.1));
    
    addHotspot({
      position: offsetPoint,
      label: `Hotspot ${hotspots.length + 1}`,
      visible: true,
    });
  }
};
```

**Why This Approach?**

*   Uses raycasting for precise surface detection
*   Automatically offsets hotspots from the surface using normals
*   Handles complex geometries and nested meshes
*   Provides immediate visual feedback

#### 2. Interactive Hotspot Markers

```typescript
// components/Hotspots/HotspotMarker.tsx
export const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // effect - always face camera
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.lookAt(state.camera.position);
      meshRef.current.scale.setScalar(hovered || isSelected ? 1.2 : 1);
    }
  });

  return (
    <group position={hotspot.position}>
      {/* 3D hotspot sphere */}
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={isSelected ? "#ff6b6b" : "#4dabf7"} />
      </mesh>
      
      {/* HTML overlay for text */}
      <Html center distanceFactor={10}>
        <div className="hotspot-label">
          {/* Inline editing system */}
          {isEditing ? <EditingInterface /> : <DisplayInterface />}
        </div>
      </Html>
    </group>
  );
};
```

**Advanced Features:**

*   **Billboard Behavior:** Hotspots always face the camera for optimal readability
*   **Hover Effects:** Visual feedback with smooth scaling animations
*   **Inline Editing:** Click to rename without separate modals
*   **Smart Styling:** Backdrop blur and responsive design

### 🎨 UI/UX Design Philosophy

I focused on creating an intuitive, professional interface:

```typescript
// components/UI/Toolbar.tsx
export const Toolbar: React.FC = () => {
  return (
    <div style={{
      position: "absolute",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(8px)",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    }}>
      {/* Context-aware controls */}
      <button
        onClick={() => setIsAddingHotspot(!isAddingHotspot)}
        style={{
          backgroundColor: isAddingHotspot ? "#ff6b6b" : "#4dabf7",
          // Visual state indication through color
        }}
      >
        {isAddingHotspot ? "Cancel" : "Add Hotspot"}
      </button>
    </div>
  );
};
```

**UX Principles Applied:**

*   **Progressive Disclosure:** Show advanced controls only when needed
*   **Visual Feedback:** Every action has immediate visual response
*   **Error Prevention:** Disable actions when not applicable
*   **Consistent Language:** Clear, action-oriented button labels

### 🔧 Performance Optimizations

I implemented several performance strategies:

#### 1. Efficient Model Loading

```typescript
// hooks/useModelLoader.ts
const loadModel = useCallback(async (file: File) => {
  return new Promise<THREE.Group>((resolve, reject) => {
    const loader = new GLTFLoader();
    
    reader.onload = (event) => {
      loader.parse(arrayBuffer, "", (gltf) => {
        const model = gltf.scene;
        
        // Automatic model optimization
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim; // Normalize to viewport
        
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        
        // Enable shadows for all meshes
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        setModel(model);
        resolve(model);
      });
    };
  });
}, [setModel]);
```

#### 2. Optimized Rendering Pipeline

```typescript
// vite.config.ts - Build optimizations
export default defineConfig({
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"], // Pre-bundle heavy deps
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"], // Separate Three.js bundle
          "react-three": ["@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
});
```

### 🎯 Meeting Each Requirement

Let me show exactly how each requirement was addressed:

*   ✅ **Requirement 1: Import GLB objects**

    *   **Solution:** Custom `useModelLoader` hook with drag & drop interface
    *   **Tech:** `FileReader` API + `GLTFLoader` with comprehensive error handling
    *   **UX:** Visual feedback during loading, format validation

*   ✅ **Requirement 2: Render and navigate 3D models**

    *   **Solution:** React Three Fiber scene with `OrbitControls`
    *   **Tech:** Optimized lighting, automatic model centering/scaling
    *   **UX:** Smooth controls with momentum, constrained movement

*   ✅ **Requirement 3: Hotspot functionality**

    *   **Solution:** Click-to-place system with raycasting
    *   **Tech:** Surface normal calculation for proper positioning
    *   **UX:** Visual feedback, inline editing, bulk operations

*   ✅ **Requirement 4: Unique naming system**

    *   **Solution:** Auto-generated names with manual override capability
    *   **Tech:** Collision-free ID generation, real-time validation
    *   **UX:** Inline editing with keyboard shortcuts

*   ✅ **Requirement 5: Delete hotspots**

    *   **Solution:** Individual delete buttons + bulk management
    *   **Tech:** Immutable state updates, reference cleanup
    *   **UX:** Confirmation through color coding, undo-friendly design

*   ✅ **Requirement 6: Show/hide hotspots**

    *   **Solution:** Global visibility toggle + individual controls
    *   **Tech:** Efficient rendering optimization, state synchronization
    *   **UX:** Clear visual indicators, accessible controls

## Installation

```bash
npm install
npm run dev
```

## Contributing

*   Fork the repository
*   Create your feature branch (`git checkout -b feature/AmazingFeature`)
*   Commit your changes (`git commit -m 'Add some AmazingFeature'`)
*   Push to the branch (`git push origin feature/AmazingFeature`)
*   Open a Pull Request

---

Built with ❤️ by Samuel Adebola Oyenuga
This project demonstrates advanced React patterns, Three.js integration, TypeScript best practices, and modern web development techniques in a production-ready 3D application.
