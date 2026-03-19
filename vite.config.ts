import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react")) {
              return "vendor";
            }
            if (id.includes("antd") || id.includes("@ant-design")) {
              return "antd";
            }
            if (id.includes("dayjs") || id.includes("lodash")) {
              return "utils";
            }
          }
        },
      },
    },
  },
});
