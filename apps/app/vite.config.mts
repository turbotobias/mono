import { redwood } from "rwsdk/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [redwood()],
});