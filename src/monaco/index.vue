<template>
  <div ref="el" :style="{ width, height }"></div>
  <EditorWorker />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, PropType } from "vue";
import { useMonacoEditor } from "./index.hook";
import { handleValidate, validate } from "./analysis";
import EditorWorker from "./editorWorker.vue";
import * as monaco from "monaco-editor";
import { Program } from "estree";
import { useMessage } from "naive-ui";
import { walkLocalAstToServerAst } from "./analysis/astToServer";

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

const message = useMessage();
const emits = defineEmits(["blur", "update:modelValue", "update:ast"]);

const { el, updateVal, getEditor, createEditor } = useMonacoEditor(
  props.language
);

const stopTestCommand = monaco.editor.addCommand({
  id: "LatexTest",
  run() {
    const { diagnosisNodes, ast } = validate(props.modelValue);
    if (diagnosisNodes.length) {
      message.warning("存在错误，请根据提示修改");
      return;
    }

    walkLocalAstToServerAst(ast! as any);
  },
});

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

onUnmounted(() => {
  stopTestCommand.dispose();
});
</script>
