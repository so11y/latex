import * as monaco from "monaco-editor"
import { provideCompletionItems } from "./completion";
import { tokenProvide } from "./tokenProvide";
import { hoverProvider } from "./hoverProvider";
import { inlayHintsProvider } from "./InlayHintsProvider";
import { codeLensesProvide } from "./codeLenseProvide";

export const setup = () => {
  monaco.languages.register({ id: "latex" });
  monaco.languages.registerCompletionItemProvider(
    "latex",
    provideCompletionItems
  );
  monaco.languages.registerHoverProvider("latex", hoverProvider);

  monaco.languages.registerInlayHintsProvider("latex", inlayHintsProvider);

  monaco.languages.setLanguageConfiguration("latex", {
    brackets: [["(", ")"]],
  });

  monaco.languages.registerCodeLensProvider("latex", codeLensesProvide);
  monaco.languages.setMonarchTokensProvider("latex", tokenProvide);
};
