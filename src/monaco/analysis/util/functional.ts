import { Node } from "estree";
import { ValidateSchemaGuardMate } from "../types";

export function NOOP() {
  return undefined;
}

export function nomadizeMarkers(
  nodes: ValidateSchemaGuardMate<Node>[],
  markers: Array<any>
) {
  for (const node of nodes) {
    if (node.errorNodes?.length) {
      nomadizeMarkers(node.errorNodes, markers);
    } else {
      const { loc } = node.node;
      markers.push({
        message: node.message ?? "未知字符",
        severity: node.severity ?? 4,
        startLineNumber: loc!.start.line,
        startColumn: loc!.start.column + 1,
        endLineNumber: loc!.end.line,
        endColumn: loc!.end.column + 1,
      });
    }
  }
  return markers;
}
