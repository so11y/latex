<template>
  <Contain :onCanAddChildren="onCanAddChildren" :onToString="onToString" />
</template>
<script lang="ts" setup>
import { inject, unref } from "vue";
import { StoreContainProvideKey, StoreValue } from "../components/storeContain";
import { ContainLatexComponentStore } from "../components/types";

const store = inject(StoreContainProvideKey)!;
function onCanAddChildren(v: StoreValue) {
  const contain = unref(v) as ContainLatexComponentStore;
  return contain.children.value.length < 1;
}
function onToString(v: StoreValue) {
  const contain = unref(v) as ContainLatexComponentStore;
  const [first] = contain.children.value;
  const latexString = store.getComponent(first.id).toStringLatex();
  return `\\left ( ${latexString} \\right ) `;
}
</script>




