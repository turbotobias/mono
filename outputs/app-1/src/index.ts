import { get_bunup_config } from "@/config-bunup/utils"

export default (): void => {
  get_bunup_config({
    name: "app-1",
    root: ".",
    entry: "src/index.ts",
  })
}
