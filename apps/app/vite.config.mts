import { redwood } from "rwsdk/vite";
import { defineConfig } from "vite";

export default defineConfig({
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