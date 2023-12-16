<template>
  <n-form :rules="rules" ref="formRef" :model="modelValue">
    <n-space justify="space-between">
      <n-form-item label="名称" path="name">
        <n-input
          size="small"
          v-model:value="modelValue.name"
          placeholder="请输入名称"
        />
      </n-form-item>
      <n-form-item label="别名" path="alias">
        <n-input
          size="small"
          v-model:value="modelValue.alias"
          placeholder="请输入别名"
        />
      </n-form-item>
    </n-space>
    <n-form-item label="参数" path="accept">
      <n-space>
        <ChooseArg
          v-if="modelValue.accept.length"
          v-model="modelValue.accept"
        />
        <n-tag @click="handleAppend">+</n-tag>
      </n-space>
    </n-form-item>
  </n-form>

  <n-space justify="end">
    <n-button size="small">取消</n-button>
    <n-button size="small" @click="handleConfirm">确定</n-button>
  </n-space>
</template>
<script lang="ts" setup>
import {
  FormInst,
  NButton,
  NFormItem,
  NForm,
  NInput,
  NSpace,
  NTag,
  useMessage,
  FormRules,
} from "naive-ui";
import { LatexValidateCallAccept } from "../analysis/helper/latexConfig";
import ChooseArg from "./chooseArg.vue";
import { AllLatexCallAccept } from "../analysis/callAccept/defaultAccept";
import { ref } from "vue";

interface Props {
  accept: Array<LatexValidateCallAccept>;
  alias: string;
  name: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: Props;
    isCreated?: boolean;
  }>(),
  {
    isCreated: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", config: Props): void;
  (e: "confirm", config: Props): void;
  (e: "close"): void;
}>();

const formRef = ref<FormInst>();
const rules: FormRules = {
  name: {
    required: true,
    message: "请输入名称",
    trigger: "blur",
  },
  alias: {
    required: true,
    message: "请输入别名",
    trigger: "blur",
  },
  accept: {
    required: true,
    type: "array",
    key: "key",
    min: 1,
    message: "请至少添加一个参数",
  },
};

function handleAppend() {
  props.modelValue.accept.push(AllLatexCallAccept[0]);
  formRef.value?.validate(
    () => {},
    (e) => {
      return e.key === "accept";
    }
  );
}

function handleConfirm() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit("update:modelValue", props.modelValue);
      emit("confirm", props.modelValue);
      emit("close");
    }
  });
}
</script>
