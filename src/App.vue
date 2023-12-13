<script setup lang="ts">
import Latex from "./features/latex.vue";
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
} from "naive-ui";
import { ref } from "vue";
import MonacoEditor from "./monaco/index.vue";
const content = ref("");
defineOptions({
  name: "App",
});
</script>

<template>
  <NDialogProvider>
    <NNotificationProvider>
      <NMessageProvider>
        <Latex />
        <monaco-editor
          v-model:modelValue="content"
          language="latex"
          :editorOptions="{
            lineNumbers: 'on',
            minimap: { enabled: true },
          }"
        />
      </NMessageProvider>
    </NNotificationProvider>
  </NDialogProvider>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
</style>
