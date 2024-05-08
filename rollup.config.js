import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve"

export default {
  input: "src/index.ts",
  output: {
    file: "dist/tableShop.js",
    format: "cjs",
    exports: "default",

  },
  plugins: [
    resolve(),
    typescript({ lib: ["es5", "es6", "es2017", "dom"], target: "es5" }),
  ],
};
