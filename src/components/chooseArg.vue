<template>
  <n-space>
    <n-tag
      type="success"
      v-for="(tag, index) in modelValue"
      :key="tag.key"
      @close="handleClose(index)"
      closable
    >
      <n-dropdown
        trigger="hover"
        label-field="describe"
        :options="(AllLatexCallAccept as any[])"
        @select="handleSelect($event, index)"
      >
        {{ tag.describe }}
      </n-dropdown>
    </n-tag>
  </n-space>
</template>

<script lang="ts" setup>
import { NSpace, NTag, NDropdown } from "naive-ui";
import { LatexValidateAccept } from "../analysis/helper/latexConfig";
import { AllLatexCallAccept } from "../analysis/callAccept/defaultAccept";

const props = defineProps<{ modelValue: Array<LatexValidateAccept> }>();

function handleSelect(key: string, index: number) {
  const accept = AllLatexCallAccept.find((accept) => accept.key === key)!;
  props.modelValue[index] = accept;
}

function handleClose(index: number) {
  props.modelValue.splice(index, 1);
}
</script>
