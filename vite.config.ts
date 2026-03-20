import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  base: "/table-with-modal",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["antd", "lodash-es"],
  },
  build: {
    target: "esnext",
    sourcemap: false, // Disable sourcemaps for production to reduce bundle size
    cssCodeSplit: true, // Enable CSS code splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("antd") || id.includes("@ant-design")) {
              return "antd";
            }
            if (id.includes("dayjs") || id.includes("lodash")) {
              return "utils";
            }
          }
        },
        // Add cache busting for back/forward cache issues
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
    minify: "terser", // Use terser for better minification
    cssMinify: "lightningcss", // Use lightningcss for faster CSS minification
  },
  // Add headers to fix back/forward cache issues
  server: {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  },
});
