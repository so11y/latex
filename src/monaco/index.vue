<template>
  <div ref="el" :style="{ width, height }"></div>
  <EditorWorker />
</template>

<script lang="ts" setup>
import { onMounted, PropType } from "vue";
import { useMonacoEditor } from "./index.hook";
import { handleValidate } from "./validateAst";
import EditorWorker from "./editorWorker.vue";
import { Program } from "acorn";

const props = defineProps({
  width: {
    type: String as PropType<string>,
    default: "100%",
  },
  height: {
    type: String as PropType<string>,
    default: "90vh",
  },
  language: {
    type: String as PropType<string>,
    default: "typescript",
  },
  preComment: {
    type: String as PropType<string>,
    default: "",
  },
  modelValue: {
    type: String as PropType<string>,
    default: "",
  },
  editorOptions: {
    type: Object as PropType<object>,
    default: () => ({}),
  },
  ast: {
    type: Object as PropType<Program>,
  },
});

const emits = defineEmits(["blur", "update:modelValue", "update:ast"]);

const { el, updateVal, getEditor, createEditor } = useMonacoEditor(
  props.language
);

onMounted(() => {
  const { model, monacoEditor } = createEditor(props.editorOptions)!;

  monacoEditor!.onDidChangeModelContent(() => {
    const { ast } = handleValidate(monacoEditor!.getValue(), model);
    emits("update:ast", ast);
    emits("update:modelValue", monacoEditor!.getValue());
  });

  monacoEditor!.onDidBlurEditorText(() => {
    emits("blur");
  });
  updateVal(props.modelValue);
});
</script>
