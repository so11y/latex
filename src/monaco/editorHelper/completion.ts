import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { LatexNames } from "../validateAst/callExpression";
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
      };
    });
    return { suggestions: suggestions };
  },
};
