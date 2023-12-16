import * as monaco from "monaco-editor";
import { Latex } from "../../analysis/latex";
import { Identifier } from "estree";

export const inlayHintsProvider: monaco.languages.InlayHintsProvider = {
  provideInlayHints() {
    const { hintsCallExpressionNodes, LatexConfig } = Latex.getInstance();
    const hints = hintsCallExpressionNodes.map((node) => {
      const { arguments: _arguments, callee, loc } = node;
      const name = (callee as Identifier).name;
      return {
        kind: monaco.languages.InlayHintKind.Type,
        label: `: ${(LatexConfig.AllLatex as any)[name].alias}`,
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
