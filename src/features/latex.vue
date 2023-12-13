<template>
  <div ref="el">${{}}$</div>
</template>
<script setup lang="ts">
import renderMathInElement from "katex/contrib/auto-render";
import { inject, nextTick, ref, unref, watch } from "vue";

const el = ref<HTMLElement>();
watch(
  () => 1,
  async () => {
    await nextTick();
    renderMathInElement(el.value!, {
      output: "mathml",
      displayMode: true,
      // preProcess(s: string) {
      //   if (s === "COUNT") {
      //     return "数据量";
      //   }
      //   console.log(s);
      //   return s;
      // },
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      // macros: {
      //   "\\myfrac": "\\frac{#1}{#2}",
      // },
      throwOnError: false,
    });
  }
);
</script>
