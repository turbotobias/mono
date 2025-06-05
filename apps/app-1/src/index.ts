import { test_a } from "@mono/a"
import { HeeeySchema } from "@mono/utils"
import { get_bunup_config } from "@mono/utilsunup/utils"

console.log(HeeeySchema.type)
console.log(test_a())

export default (): void => {
  get_bunup_config({
    name: "app-1",
    root: ".",
    entry: "src/index.ts",
  })
}
