import viteConfig from "./vite.config";
import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  //@ts-ignore
  viteConfig,
  defineConfig({
    test: {
      environment: "happy-dom",
    },
  })
);
