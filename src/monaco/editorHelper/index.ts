import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { provideCompletionItems } from "./completion";
import { tokenProvide } from "./tokenProvide";

export const setup = () => {
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
