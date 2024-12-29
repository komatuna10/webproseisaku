import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
const PORT = process.env.PORT || 5173;
exports.PORT = PORT;
