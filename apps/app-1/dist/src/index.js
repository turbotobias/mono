import { HeeeySchema } from "@mono/b"
import { get_bunup_config } from "@mono/bunup/utils"
console.log(HeeeySchema.type)
export default () => {
    get_bunup_config({
        name: "app-1",
        root: ".",
        entry: "src/index.ts",
    })
}
