import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";
  return {
    plugins: [react()],
    server: {
      port: 3002,
      open: true,
      https: {
        key:
          isDev && fs.readFileSync(path.join(__dirname, "./localhost-key.pem")),
        cert: isDev && fs.readFileSync(path.join(__dirname, "./localhost.pem")),
      },
      watch: {
        ignored: ["**/node_modules/**", "**/.git/**"],
      },
    },
  };
});
