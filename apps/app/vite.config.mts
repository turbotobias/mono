import { redwood } from "rwsdk/vite";
import { defineConfig, type UserConfig } from "vite";

const config: UserConfig = defineConfig({
  plugins: [redwood()],
});

export default config