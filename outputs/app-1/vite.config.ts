import config from "@/config-vite"
import type { UserConfig } from "vite"

export default {
  ...(config && { config }),

} satisfies UserConfig