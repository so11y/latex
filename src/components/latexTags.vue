<style lang="scss" scoped>
.tag-layout {
  padding: 20px 10px;
}
</style>
<template>
  <div class="tag-layout">
    <n-space>
      <n-tag
        @click="handleDialog(tag)"
        v-for="tag in callConfigs"
        :key="tag.name"
        @close="handleRemove(tag)"
        closable
      >
        {{ tag.alias }} {{ tag.name }}
      </n-tag>
      <n-tag @click="handleAddLatexCall">+</n-tag>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { Latex } from "../analysis/latex";
import {
  NTag,
  NSpace,
  useDialog,
  NMessageProvider,
  useMessage,
} from "naive-ui";
import LatexDialog from "./latexDialog.vue";
import { h, ref } from "vue";
import { LatexCallConfigType } from "../analysis/helper/latexConfig";
import { EditorHelper } from "../monaco/editorHelper/index";
import * as monaco from "monaco-editor";
const message = useMessage();

const callConfigs = ref(Latex.getInstance().LatexConfig.LatexCallConfig);

const dialog = useDialog();

function handleDialog(config: LatexCallConfigType) {
  const { accept } = config.config;
  const shallowAccept = ref(accept.slice());
  dialog.success({
    title: config.alias,
    content: () => {
      return h(NMessageProvider, null, {
        default: () => {
          return h(LatexDialog, {
            modelValue: shallowAccept.value,
          });
        },
      });
    },
    onPositiveClick: () => {
      config.config.accept = shallowAccept.value;
      message.success("参数修改成功！");
    },
    positiveText: "确认",
  });
}

function handleAddLatexCall() {}

function handleRemove(config: LatexCallConfigType) {
  dialog.warning({
    title: "删除确认",
    content: "确认删除该标签吗？",
    onPositiveClick: () => {
      Reflect.deleteProperty(callConfigs.value, config.name);
      const editorHelper = EditorHelper.getInstance();
      editorHelper.setupTokensProvider();
      EditorHelper.getInstance()
        .editor!.getAction("LatexValidateEditorMarkers")
        ?.run();
    },
    positiveText: "确认",
  });
}
</script>
