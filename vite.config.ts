import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const page = (file: string) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    target: "esnext",
    minify: "oxc",
    cssMinify: true,
    rollupOptions: isSsrBuild
      ? {
          // Build de servidor para el prerender: un único entry-server.js en la raíz de dist-ssr/.
          output: { entryFileNames: "[name].js" },
        }
      : {
          // Una entrada HTML por página indexable.
          input: {
            main: page("./index.html"),
            herbal: page("./herbal.html"),
            gin: page("./gin.html"),
            // También sirve de plantilla para /cocteles/<receta> (scripts/prerender.mjs).
            cocteles: page("./cocteles.html"),
          },
          output: {
            manualChunks: (id: string) => {
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
}));
