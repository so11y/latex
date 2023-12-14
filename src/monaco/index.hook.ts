import { ref, onBeforeUnmount, nextTick } from "vue";
import * as monaco from "monaco-editor";
import { setup } from "./editorHelper/index";

setup();

export const useMonacoEditor = (language: string, value: string = "") => {
  let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
  let initReadOnly = false;
  const el = ref<HTMLElement | null>(null);

  // 格式化
  const onFormatDoc = async () => {
    await monacoEditor?.getAction("monacoEditor.action.formatDocument")?.run();
  };

  // 更新
  const updateVal = (val: string) => {
    nextTick(async () => {
      monacoEditor?.setValue(val);
    });
  };

  // 创建实例
  const createEditor = (
    editorOption: monaco.editor.IStandaloneEditorConstructionOptions = {}
  ) => {
    if (!el.value) return;
    initReadOnly = !!editorOption.readOnly;
    const model = monaco.editor.createModel(value, language);
    // 创建
    monacoEditor = monaco.editor.create(el.value, {
      model,
      fontSize:18,
      theme: "vs-dark",
    });

    return {
      monacoEditor,
      model,
    };
  };

  // 卸载
  onBeforeUnmount(() => {
    if (monacoEditor) monacoEditor.dispose();
  });

  return {
    el,
    updateVal,
    getEditor: () => monacoEditor,
    createEditor,
    onFormatDoc,
  };
};
