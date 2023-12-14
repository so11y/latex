<script setup lang="ts">
import Latex from "./features/latex.vue";
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
} from "naive-ui";
import { ref, shallowRef } from "vue";
import MonacoEditor from "./monaco/index.vue";
const content = ref(`Conditional(
    1==1 && 2 >= 3 ? Max("1") : Max("b"),
    Max("aa"),
    Min("1")
)`);
const ast = shallowRef();
</script>

<template>
  <NDialogProvider>
    <NNotificationProvider>
      <NMessageProvider>
        <div class="latex">
          <Latex :ast="ast" />
        </div>
        <div class="buttons"></div>
        <div class="main">
          <div class="slider"></div>
          <div class="editor">
            <monaco-editor
              v-model="content"
              v-model:ast="ast"
              language="latex"
              :editorOptions="{
                lineNumbers: 'on',
                minimap: { enabled: true },
              }"
            />
          </div>
        </div>
      </NMessageProvider>
    </NNotificationProvider>
  </NDialogProvider>
</template>

<style setup lang="scss">
* {
  padding: 0;
  margin: 0;
}
.latex {
  padding: 20px 10px;
}
</style>
