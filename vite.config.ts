import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { transformManifest } from "./utils/plugins/manifest-transform";
import { duplicateBuild } from "./utils/plugins/duplicate-build";

import { manifest as manifestV3File } from "./manifest";

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, "src");
const pagesDir = resolve(srcDir, "pages");
const distDir = resolve(rootDir, "dist");
const publicDir = resolve(rootDir, "public");

const isDev = process.env.NODE_ENV === "development";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": srcDir,
    },
  },
  plugins: [
    react(),
    transformManifest({ isDev, manifestV3File, distDir, publicDir }),
    duplicateBuild(distDir),
  ],
  publicDir,
  root: rootDir,
  build: {
    outDir: distDir,
    emptyOutDir: true,
    sourcemap: isDev,
    minify: !isDev,
    rollupOptions: {
      input: {
        content: resolve(pagesDir, "content/index.ts"),
        background: resolve(pagesDir, "background/index.ts"),
        popup: resolve(pagesDir, "popup/index.html"),
        panel: resolve(pagesDir, "panel/index.html"),
        onboarding: resolve(pagesDir, "onboarding/index.html"),
      },
      output: {
        entryFileNames: `src/pages/[name]/index.js`,
        chunkFileNames: isDev
          ? "assets/js/[name].js"
          : "assets/js/[name].[hash].js",
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "index.css") {
            return `assets/css/[name].css`;
          }
          return `assets/[ext]/[name].[hash].[ext]`;
        },
      },
    },
  },
});
