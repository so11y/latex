import * as monaco from "monaco-editor";
import { ValidateSchemaGuardMate } from "./types";
import { validate } from "./validate";
import { Node } from "estree";

export function nomadizeMarkers(
  nodes: ValidateSchemaGuardMate<Node>[],
  markers: monaco.editor.IMarkerData[]
) {
  for (const node of nodes) {
    if (node.errorNodes?.length) {
      nomadizeMarkers(node.errorNodes, markers);
    } else {
      const { loc } = node.node;
      markers.push({
        message: node.message ?? "未知字符",
        severity: node.severity ?? monaco.MarkerSeverity.Error,
        startLineNumber: loc!.start.line,
        startColumn: loc!.start.column + 1,
        endLineNumber: loc!.end.line,
        endColumn: loc!.end.column + 1,
      });
    }
  }
  return markers;
}

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
