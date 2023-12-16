<script setup lang="ts">
import Latex from "./components/latex.vue";
import {
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
} from "naive-ui";
import { ref, shallowRef } from "vue";
import MonacoEditor from "./monaco/editor.vue";
import latexTags from "./components/latexTags.vue";

const content = ref(`1==1 && 2 >= 3`);

const ast = shallowRef();
</script>

<template>
  <NDialogProvider>
    <NNotificationProvider>
      <NMessageProvider>
        <div class="root">
          <Latex :ast="ast" />
          <latexTags />
          <monaco-editor v-model="content" v-model:ast="ast" />
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
.root {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  .main {
    display: flex;
    flex: 1;
  }
}
</style>
