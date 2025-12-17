import path from "path"
import { defineConfig } from 'vite'
import { fileURLToPath } from "url"
import react from '@vitejs/plugin-react-swc'
import commonjs from "vite-plugin-commonjs";
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss(), commonjs()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
