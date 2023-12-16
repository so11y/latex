<template>
  <n-space>
    <n-tag
      type="success"
      v-for="(tag, index) in modelValue"
      :key="tag.key"
      @close="handleClose(index)"
      closable
    >
      <!-- 我靠 这个库真勾八难用 -->
      <n-dropdown
        trigger="hover"
        label-field="describe"
        :options="(AllLatexCallAccept as any[])"
        @select="handleSelect($event, index)"
      >
        {{ tag.describe }}
      </n-dropdown>
    </n-tag>

    <n-tag @click="handleAppend">+</n-tag>
  </n-space>
</template>
<script lang="ts" setup>
import { useMessage, NSpace, NTag, NDropdown } from "naive-ui";
import { LatexValidateCallAccept } from "../analysis/helper/latexConfig";
import { AllLatexCallAccept } from "../analysis/callAccept/defaultAccept";

const props = defineProps<{ modelValue: Array<LatexValidateCallAccept> }>();

const message = useMessage();

function handleSelect(key: string, index: number) {
  const accept = AllLatexCallAccept.find((accept) => accept.key === key)!;
  props.modelValue[index] = accept;
}

function handleClose(index: number) {
  if (props.modelValue.length === 1) {
    message.error("总不能一个参数都不要把");
    return;
  }
  props.modelValue.splice(index, 1);
}

function handleAppend() {
  props.modelValue.push(AllLatexCallAccept[0]);
}
</script>
