import { redwood } from "rwsdk/vite";
import { defineConfig } from "vite";

export default defineConfig({
  worker: {
    format: "es",
  },
  server: {
    port: 3000,
  },
  plugins: [redwood({
    mode: "development",
    entry: {
      client: "./src/client.tsx",
      worker: "./src/worker.tsx",
    },
  })],
});