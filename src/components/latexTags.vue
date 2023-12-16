<style lang="scss" scoped>
.tag-layout {
  padding: 20px 10px;
}
</style>
<template>
  <div class="tag-layout">
    <n-space>
      <n-tag
        @click="openDialog(tag)"
        v-for="tag in callConfigs"
        :key="tag.name"
        @close="handleRemove(tag)"
        closable
      >
        {{ tag.alias }} {{ tag.name }}
      </n-tag>
      <n-tag @click="openDialog(null)">+</n-tag>
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
import { Ref, ref, toRaw, triggerRef } from "vue";
import { LatexCallConfigType } from "../analysis/helper/latexConfig";
import { EditorHelper } from "../monaco/editorHelper/index";
import { cloneDeep } from "lodash-es";
const message = useMessage();

const callConfigs = ref(Latex.getInstance().LatexConfig.LatexCallConfig);

const dialog = useDialog();

const { openDialog, title, config, handleUpdateLatexCall, showModal } =
  useHandleCallFnConfig();

function useHandleCallFnConfig() {
  const builderConfig = (): LatexCallConfigType => ({
    config: {
      accept: [],
    },
    alias: "",
    name: "",
  });
  const config = ref() as Ref<LatexCallConfigType>;
  const isCreate = ref(false);
  const showModal = ref(false);
  const title = ref("");
  let currentConfig: LatexCallConfigType | null = null;

  const openDialog = (owenConfig: LatexCallConfigType | null) => {
    if (owenConfig) {
      config.value = cloneDeep(owenConfig!);
      title.value = owenConfig.alias;
      currentConfig = owenConfig;
    } else {
      title.value = "新增标签";
      config.value = builderConfig();
    }
    showModal.value = true;
    isCreate.value = !!owenConfig;
  };

  const handleUpdateLatexCall = () => {
    if (isCreate.value) {
      const inst = Latex.getInstance().LatexConfig;
      inst.putCallExpression(toRaw(config.value!));
      triggerRef(callConfigs);
      EditorHelper.getInstance().reValidate();
      message.success("新增标签成功！");
    } else {
      Object.assign(currentConfig!, toRaw(config.value));
      EditorHelper.getInstance().reValidate();
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
      EditorHelper.getInstance().reValidate();
    },
    positiveText: "确认",
  });
}
</script>
