import * as monaco from "monaco-editor"
import { validate } from "./validate";
import { nomadizeMarkers } from "./util/functional";

export function handleValidate(value: string, model: monaco.editor.ITextModel) {
  let { ast, diagnosisNodes } = validate(value);
  const markers: monaco.editor.IMarkerData[] = nomadizeMarkers(
    diagnosisNodes,
    []
  );
  if (markers.length) {
    ast = null;
  }
  monaco.editor.setModelMarkers(model, "owner", markers);
  return {
    ast,
  };
}
