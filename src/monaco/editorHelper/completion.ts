import * as monaco from "monaco-editor";
import { LatexNames, AllLatex } from "../analysis/helper/latexConfig";
export const provideCompletionItems: monaco.languages.CompletionItemProvider = {
  provideCompletionItems: (model, position) => {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };
    const suggestions = LatexNames.map((key) => {
      return {
        label: key,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: `${key}` + "(${1})",
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
        detail: AllLatex[key as keyof typeof AllLatex]?.alias,
      };
    });
    return { suggestions: suggestions };
  },
};
