import { defineConfig } from "tsdown";

/** Build both public entries separately so each inlines shared internal helpers. */

export default defineConfig([
    {
        entry: ["src/services/*.ts"],
        format: ["esm"],
        dts: true,
        clean: true,
    }
]);