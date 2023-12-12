<template>
  <div ref="el" :style="{ width, height }"></div>
  <EditorWorker />
</template>

<script lang="ts" setup>
import { onMounted, PropType } from "vue";
import { useMonacoEditor } from "./index.hook";
import EditorWorker from "./EditorWorker.vue"
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { handleValidate } from "./validateAst"

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
});

const emits = defineEmits(["blur", "update:modelValue"]);

const { el, updateVal, getEditor, createEditor } = useMonacoEditor(
  props.language
);

onMounted(() => {
  const uri = monaco.Uri.parse("inmemory://test");
  const { model, monacoEditor } = createEditor(props.editorOptions,);
  const value = `1 +  3 / 5 + Count(3)`;


  monacoEditor!.onDidChangeModelContent(() => {

    handleValidate(monacoEditor!.getValue(), model)
    emits("update:modelValue", monacoEditor!.getValue());
  });
  monacoEditor!.onDidBlurEditorText(() => {
    emits("blur");
  });
  updateVal(
    value
  );
});
</script>
