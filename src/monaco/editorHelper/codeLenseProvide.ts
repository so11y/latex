import * as monaco from "monaco-editor";
export const codeLensesProvide: () => monaco.languages.CodeLensProvider =
  () => ({
    provideCodeLenses(model, token) {
      return {
        lenses: [
          {
            range: {
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: 1,
              endColumn: 1,
            },
            command: {
              id: "LatexTest",
              title: "点击执行测试",
            },
          },
        ],
        dispose: () => {},
      };
    },
    resolveCodeLens: function (model, codeLens, token) {
      return codeLens;
    },
  });
