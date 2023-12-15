import * as monaco from "monaco-editor";
import { Latex } from "./validate";

export function handleValidate(value: string, model: monaco.editor.ITextModel) {
  let { ast, markers } = Latex.getInstance().getMarkers(value);
  monaco.editor.setModelMarkers(model, "owner", markers);
  return {
    ast,
  };
}
