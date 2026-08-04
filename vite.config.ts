import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => ({
  // GitHub Pages publica este repositorio dentro de /degree-progress/.
  // En desarrollo se conserva la raíz para seguir usando localhost:5173.
  base: command === "build" ? "/degree-progress/" : "/",
  plugins: [react(), tailwindcss()],
}));
