<template></template>

<script setup>
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

self.MonacoEnvironment = {
  getWorker(workerId, label) {
    return new editorWorker();
  },
};
</script>
