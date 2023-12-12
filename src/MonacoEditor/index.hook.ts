import { ref, onBeforeUnmount, nextTick } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { keys } from "../use/constName";
monaco.languages.register({ id: "latex" });


monaco.languages.registerCompletionItemProvider("latex", {
  provideCompletionItems: (model, position) => {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };
    const suggestions = keys.map((key) => {
      return {
        label: key,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: `${key}` + "(${1})",
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
      };
    });
    return { suggestions: suggestions };
  },
});
monaco.languages.setLanguageConfiguration("latex", {
  brackets: [["(", ")"]],
});

monaco.languages.setMonarchTokensProvider("latex", {
  operators: ["+", "-", "*", "/"],
  keywords: keys,
  escapes:
    /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  tokenizer: {
    root: [
      [
        /@?[a-zA-z][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@default": "identifier",
          },
        },
      ],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/\d+/, "number"],
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],
    bracketCounting: [
      [/\{/, "delimiter.bracket", "@bracketCounting"],
      [/\}/, "delimiter.bracket", "@pop"],
      { include: "root" },
    ],
  },
});

export const useMonacoEditor = (language = "javascript", value: string = "") => {
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
      theme: "vs-dark",
    });

    return {
      monacoEditor,
      model
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
