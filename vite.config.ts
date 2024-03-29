import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/html_builder/",
  build: {
    outDir: "build/html_builder",
    rollupOptions: {
      output: {
        format: "esm",
        assetFileNames: (assetInfo) => {
          if (assetInfo?.name?.endsWith(".css")) {
            return "assets/html-builder.css";
          }

          return assetInfo.name ?? "";
        },
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      "@/config": path.resolve(__dirname, "./src/config/config.js"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    federation({
      name: "html-builder",
      filename: "builderEntry.js",
      exposes: {
        "./HtmlBuilder": "./src/html-builder",
      },
    }),
  ],
});
