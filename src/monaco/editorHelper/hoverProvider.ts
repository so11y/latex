import * as monaco from "monaco-editor"
import { AllLatex, LatexNames } from "../analysis/helper/latexConfig";

export const hoverProvider: monaco.languages.HoverProvider = {
  provideHover: function (model, position) {
    const world = model.getWordAtPosition(position);
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
