import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  plugins: [
    react({
      fastRefresh: false, // Disables React Fast Refresh (debugging)
    }),
  ],
  build: {
    chunkSizeWarningLimit: 500, // Suppresses large chunk warnings
    sourcemap: true, // Enables source maps for better debugging
  },
  server: {
    proxy: {
      "/api": {
        target: "https://null-class-five.vercel.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
