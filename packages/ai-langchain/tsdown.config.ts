import { defineConfig } from "tsdown";

/** Build both public entries separately so each inlines shared internal helpers. */

export default defineConfig([
    {
        entry: ["src/index.ts","src/services/*.ts"],
        format: ["esm"],
        dts: true,
        clean: true,
        exports: true, // 自动生成 exports 字段
    }
]);