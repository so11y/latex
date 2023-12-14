<template></template>

<script setup>
iimport * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";i
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    return new editorWorker();
  },
};
</script>
