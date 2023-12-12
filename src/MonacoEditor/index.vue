<template>
  <div ref="el" :style="{ width, height }"></div>
  <EditorWorker />
</template>

<script lang="ts" setup>
import { onMounted, PropType } from "vue";
import { useMonacoEditor } from "./index.hook";
import EditorWorker from "./EditorWorker.vue"
import {validate} from "./validateAst"

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
  const monacoEditor = createEditor(props.editorOptions);

  monacoEditor!.onDidChangeModelContent(() => {

    validate(monacoEditor!.getValue())
    emits("update:modelValue", monacoEditor!.getValue());
  });
  monacoEditor!.onDidBlurEditorText(() => {
    emits("blur");
  });
  updateVal(
    `Plus(1,
    Div(2,3)
)`
  );
});
</script>
