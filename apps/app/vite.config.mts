import { redwood } from "rwsdk/vite";
import { defineConfig } from "vite";

export default defineConfig({
  worker: {
    format: "es",
  },
  server: {
    port: 3000,
  },
  plugins: [
    {
      name: 'print-import-resolve',
      async resolveId(source, importer) {
        if (source.startsWith('@mono/')) {
          const resolved = await this.resolve(source, importer, { skipSelf: true });
          console.log(`Import "${source}" from "${importer}" resolved to:`, resolved?.id);
        }
        return null; // let Vite handle resolution
      }
    },
    redwood({
      mode: "development",
      entry: {
        client: "./src/client.tsx",
        worker: "./src/worker.tsx",
      },
    }),

  ]
});