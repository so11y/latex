import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { provideCompletionItems } from "./completion";
import { tokenProvide } from "./tokenProvide";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
export const setup = () => {
  (self as any).MonacoEnvironment = {
    getWorker() {
      return new editorWorker();
    },
  };
  monaco.languages.register({ id: "latex" });
  monaco.languages.registerCompletionItemProvider(
    "latex",
    provideCompletionItems
  );
  monaco.languages.setLanguageConfiguration("latex", {
    brackets: [["(", ")"]],
  });
  monaco.languages.setMonarchTokensProvider("latex", tokenProvide);
};
