import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    APP_VERSION: JSON.stringify(require("./package.json").version),
  },
  server: {
    hmr: {
      overlay: false,
    },
    port: 3000,
    host: true,
    proxy: {
      "/socket.io": {
        target: "http://localhost:3001",
        changeOrigin: false,
        secure: false,
        ws: true,
      },
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: false,
        secure: false,
        ws: true,
      },
    },
  },
  worker: {
    format: "es",
  },
  build: {
    manifest: true,
    rollupOptions: {
      external: ["src/services/imageActions/nodeImageActions.ts", "@napi-rs/canvas"],
      plugins: [],
    },
    outDir: "./build",
    target: ["chrome89", "edge89", "safari15", "firefox89"], // supports top_level_await & wasm
  },
});
