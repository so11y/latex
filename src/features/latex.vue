<template>
  <div ref="el">${{ astToLatexString }}$</div>
</template>
<script setup lang="ts">
import renderMathInElement from "katex/contrib/auto-render";
import { computed, nextTick, ref, watch } from "vue";
import { Program } from "estree";
import { toLatexString } from "../monaco/analysis/astToString";

const props = defineProps<{
  ast?: Program;
}>();

const astToLatexString = computed(() => {
  if (props.ast) {
    return toLatexString(props.ast);
  }
  return "";
});

const el = ref<HTMLElement>();
watch(astToLatexString, async () => {
  await nextTick();
  renderMathInElement(el.value!, {
    output: "mathml",
    displayMode: true,
    // preProcess(s: string) {
    //   if (s === "COUNT") {
    //     return "数据量";
    //   }
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
});
</script>
../monaco/analysis/astToString