<style lang="scss" scoped>
.editor-layout {
  flex: 1;
  position: relative;
  .editor-layout__position {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .monaco {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<template>
  <div class="editor-layout">
    <div class="editor-layout__position">
      <div class="monaco" ref="el"></div>
    </div>
  </div>
  <EditorWorker />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, PropType } from "vue";
import { useMonacoEditor } from "./useEditor";
import { handleValidate } from "../analysis";
import { Latex } from "../analysis/latex";
import EditorWorker from "./editorWorker.vue";
import * as monaco from "monaco-editor";
import { Program } from "estree";
import { useMessage } from "naive-ui";
import { walkLocalAstToServerAst } from "../analysis/astToServer";
import { EditorHelper } from "./editorHelper";

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: "",
  },
  ast: {
    type: Object as PropType<Program>,
  },
});

const message = useMessage();
const emits = defineEmits(["blur", "update:modelValue", "update:ast"]);

const { el, updateVal, createEditor, getEditor } = useMonacoEditor("latex");

const stopTestCommand = monaco.editor.addCommand({
  id: "LatexTest",
  run() {
    console.log("io99");
    const { diagnosisNodes, ast } = Latex.getInstance().validate(
      props.modelValue
    );
    if (diagnosisNodes.length) {
      message.warning("存在错误，请根据提示修改");
      return;
    }

    walkLocalAstToServerAst(ast! as any);
    console.log(ast, "---");
  },
});

onMounted(() => {
  const { monacoEditor } = createEditor()!;
  //后面再优化这个editor的存放
  EditorHelper.getInstance().editor = monacoEditor;
  monacoEditor.addAction({
    id: "LatexValidateEditorMarkers",
    label: "LatexValidateEditorMarkers",
    run() {
      const { ast } = handleValidate(
        getEditor()!.getValue(),
        getEditor()!.getModel()!
      );
      emits("update:ast", ast);
    },
  });

  monacoEditor!.onDidChangeModelContent(() => {
    monacoEditor.getAction("LatexValidateEditorMarkers")?.run();
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
