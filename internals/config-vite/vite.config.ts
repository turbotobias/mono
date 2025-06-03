import type { UserConfig } from 'vite'

export const config: UserConfig = {
  appType: "custom",
  worker: {
    format: "es",
  }
}

export default config