import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import prefixer from 'postcss-prefix-selector';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sa-dash/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
});