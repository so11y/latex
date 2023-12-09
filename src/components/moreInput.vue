<style>
input {
  border: none;
  outline: none;
  align-self: flex-start;
  text-align: center;
  margin-right: 2px;
  color: #999;
  border: none;
  outline: none;
  width: 30px;
  padding: 0 4px;
  margin-left: 6px;
  border-bottom: 1px solid #999;
  transform: translateY(-4px);
  background: transparent;

  &:disabled {
    cursor: not-allowed;
  }
}
</style>



<template>
  <span v-for="(item, index) in labels" :key="item">
    <input v-if="!source.children.value[index]" @click="handleActive(index, source)" :placeholder="item" />
  </span>
</template>
<script setup lang="ts">
import { type ContainLatexComponentStore } from "./types";

defineProps<{
  labels: Array<string>;
  source: ContainLatexComponentStore;
}>();
const emit = defineEmits<{
  (
    event: "handle",
    value: {
      index: number;
      source: ContainLatexComponentStore;
    }
  ): void;
}>();

function handleActive(index: number, source: ContainLatexComponentStore) {
  emit("handle", {
    index,
    source,
  });
}
</script>


