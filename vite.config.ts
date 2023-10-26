import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    APP_VERSION: JSON.stringify(require("./package.json").version),
  },
  server: {
    port: 3000,
    host: true,
  },
  worker: {
    format: "es",
  },
  build: {
    rollupOptions: {
      plugins: [],
    },
    outDir: "./build",
    target: ["chrome89", "edge89", "safari15", "firefox89"], // supports top_level_await & wasm
  },
});
