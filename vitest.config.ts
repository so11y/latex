import viteConfig from "./vite.config";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  //@ts-ignore
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        "monaco-editor": "monaco-editor/esm/vs/editor/editor.api.js"
      }
    },
    define: {
      __Test__: true,
    },
    test: {
      environment: "happy-dom",
    },
  })
);
