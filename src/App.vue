<script setup lang="ts">
import Latex from "./features/latex.vue";
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
} from "naive-ui";
import { ref, shallowRef } from "vue";
import MonacoEditor from "./monaco/index.vue";
const content = ref("1 +  3 / 5 + Count(3)");
const ast = shallowRef();
</script>

<template>
  <NDialogProvider>
    <NNotificationProvider>
      <NMessageProvider>
        <Latex :ast="ast"/>
        <monaco-editor
          v-model="content"
          v-model:ast="ast"
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
