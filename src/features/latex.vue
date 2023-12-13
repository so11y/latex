<template>
  <div ref="el">${{ astToLatexString }}$</div>
</template>
<script setup lang="ts">
import renderMathInElement from "katex/contrib/auto-render";
import { computed, inject, nextTick, ref, unref, watch } from "vue";
import { Program } from "acorn";
import { toLatexString } from "../monaco/validateAst/astToString";

const props = defineProps<{
  ast?: Program;
}>();

const astToLatexString = computed(() => {
  console.log(props.ast);
  if (props.ast) {
    return toLatexString(props.ast);
  }
  return "";
});

const el = ref<HTMLElement>();
watch(astToLatexString, async () => {
  console.log(astToLatexString.value);
  // await nextTick();
  // renderMathInElement(el.value!, {
  //   output: "mathml",
  //   displayMode: true,
  //   // preProcess(s: string) {
  //   //   if (s === "COUNT") {
  //   //     return "数据量";
  //   //   }
  //   //   console.log(s);
  //   //   return s;
  //   // },
  //   delimiters: [
  //     { left: "$$", right: "$$", display: true },
  //     { left: "$", right: "$", display: false },
  //     { left: "\\(", right: "\\)", display: false },
  //     { left: "\\[", right: "\\]", display: true },
  //   ],
  //   // macros: {
  //   //   "\\myfrac": "\\frac{#1}{#2}",
  //   // },
  //   throwOnError: false,
  // });
});
</script>
