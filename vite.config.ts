import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          "react-three": ["@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
  assetsInclude: ["**/*.glb", "**/*.gltf"],
});
