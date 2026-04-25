import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
    minify: "oxc",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) return "vendor";
        },
        // Cache-busting filenames
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // Increase warning threshold slightly for info
    chunkSizeWarningLimit: 600,
  },
  // Optimized dependency pre-bundling
  optimizeDeps: {
    include: ["react", "react-dom", "framer-motion"],
  },
});
