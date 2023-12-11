import viteConfig from "./vite.config";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  //@ts-ignore
  viteConfig,
  defineConfig({
    define: {
      __Test__: true
    },
    test: {
      environment: "happy-dom",
    },
  })
);
