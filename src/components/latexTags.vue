<style lang="scss" scoped>
.tag-layout {
  padding: 20px 10px;
}
</style>
<template>
  <div class="tag-layout">
    <n-space>
      <n-tag
        @click="openDialog(tag, false)"
        v-for="tag in callConfigs"
        :key="tag.name"
        @close="handleRemove(tag)"
        closable
      >
        {{ tag.alias }} {{ tag.name }}
      </n-tag>
      <n-tag @click="openDialog(null, true)">+</n-tag>
    </n-space>

    <n-modal v-model:show="showModal" preset="dialog" :title="title">
      <LatexDialog
        v-model="config"
        @confirm="handleUpdateLatexCall"
        @close="showModal = false"
      />
    </n-modal>
  </div>
</template>

<script setup lang="tsx">
import { Latex } from "../analysis/latex";
import { NModal, NTag, NSpace, useDialog, useMessage } from "naive-ui";
import LatexDialog from "./latexDialog.vue";
import { ref } from "vue";
import {
  LatexCallConfigType,
  LatexValidateCallAccept,
} from "../analysis/helper/latexConfig";
import { EditorHelper } from "../monaco/editorHelper/index";
const message = useMessage();

const callConfigs = ref(Latex.getInstance().LatexConfig.LatexCallConfig);

const dialog = useDialog();

const { openDialog, title, config, handleUpdateLatexCall, showModal } =
  useHandleCallFnConfig();

function useHandleCallFnConfig() {
  const builderConfig = () => ({
    accept: [] as Array<LatexValidateCallAccept>,
    alias: "",
    name: "",
  });
  const config = ref(builderConfig());
  const isCreate = ref(false);
  const showModal = ref(false);
  const title = ref("");
  let currentConfig: LatexCallConfigType | null = null;

  const openDialog = (
    owenConfig: LatexCallConfigType | null,
    owenIsCreate = false
  ) => {
    config.value = builderConfig();
    if (owenConfig) {
      config.value.accept = owenConfig.config.accept.slice();
      title.value = owenConfig.alias;
      config.value.alias = owenConfig.alias;
      config.value.name = owenConfig.name;
      currentConfig = owenConfig;
    } else {
      title.value = "新增标签";
    }
    showModal.value = true;
    isCreate.value = owenIsCreate;
  };

  const handleUpdateLatexCall = () => {
    //这里后面把参数传递优化一下，两个组件参数格式没统一
    if (isCreate.value) {
      const { name, alias, accept } = config.value;
      if (Reflect.has(callConfigs.value, name)) {
        message.warning("已存在该标签，请修改名称");
        return;
      }
      (callConfigs.value as any)[name] = {
        name,
        alias,
        config: {
          accept,
        },
      };

      const editorHelper = EditorHelper.getInstance();
      editorHelper.editor!.getAction("LatexValidateEditorMarkers")?.run();
      editorHelper.setupTokensProvider();
      message.success("新增标签成功！");
    } else {
      currentConfig!.config.accept = config.value.accept;
      currentConfig!.alias = config.value.alias;
      currentConfig!.name = config.value.name;
      const editorHelper = EditorHelper.getInstance();
      editorHelper.editor!.getAction("LatexValidateEditorMarkers")?.run();
      editorHelper.setupTokensProvider();
      message.success("参数修改成功！");
    }
  };

  return {
    config,
    isCreate,
    showModal,
    openDialog,
    handleUpdateLatexCall,
    title,
  };
}

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
