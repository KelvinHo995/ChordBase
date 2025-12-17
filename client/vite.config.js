import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import commonjs from "vite-plugin-commonjs";
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), commonjs()],
})
