export const get_bunup_config = ({ name, root, entry = "src/index.ts" }) => ({
    name,
    root,
    config: {
        entry,
        format: ["esm"],
        dts: true,
        sourcemap: "linked", // +4% increase in size
    }
});
