import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis", // 👈 define global
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // 👇 Important to polyfill for production build
        rollupNodePolyFill(),
      ],
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          "pdf-viewer": ["react-pdf", "pdfjs-dist"],
          emojis: ["@emoji-mart/react"],
        },
      },
    },
  },
});
