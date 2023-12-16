import * as monaco from "monaco-editor";
import { Latex } from "../../analysis/latex";

export const hoverProvider: monaco.languages.HoverProvider = {
  provideHover: function (model, position) {
    const world = model.getWordAtPosition(position);
    const { LatexNames, AllLatex } = Latex.getInstance().LatexConfig;
    if (world && LatexNames.includes(world.word)) {
      return {
        contents: [
          {
            value: AllLatex[world.word as keyof typeof AllLatex].alias,
          },
        ],
      };
    }
  },
};
