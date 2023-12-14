import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { getCallExpressionNodes } from "../analysis/validate";
import { Identifier } from "estree";
import { AllLatex, LatexCallConfig } from "../analysis/latexConfig";

export const inlayHintsProvider: monaco.languages.InlayHintsProvider = {
  provideInlayHints() {
    const nodes = getCallExpressionNodes();
    const hints = nodes.map((node) => {
      const { arguments: _arguments, callee, loc } = node;
      const name = (callee as Identifier).name as keyof typeof LatexCallConfig;
      return {
        kind: monaco.languages.InlayHintKind.Type,
        label: `: ${AllLatex[name].alias}`,
        position: {
          column: loc!.end.column + 1,
          lineNumber: loc?.end.line,
        },
      };
    }) as monaco.languages.InlayHint[];
    return {
      hints,
      dispose: () => {},
    };
  },
};
