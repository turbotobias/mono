import { get_bunup_config } from "@mono/config-bunup/utils"
export default () => {
    get_bunup_config({
        name: "app-1",
        root: ".",
        entry: "src/index.ts",
    })
}
