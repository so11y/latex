import { Node } from "estree";
import { ValidateGuardFalseMate } from "../types";

export function nomadizeMarkers(
  nodes: ValidateGuardFalseMate<Node>[],
  markers: Array<any>
) {
  for (const node of nodes) {
    if (node.errorNodes?.length) {
      nomadizeMarkers(node.errorNodes, markers);
    } else {
      const { loc } = node.node;
      markers.push({
        message: node.message ?? "未知字符",
        severity: node.severity ?? 8,
        startLineNumber: loc!.start.line,
        startColumn: loc!.start.column + 1,
        endLineNumber: loc!.end.line,
        endColumn: loc!.end.column + 1,
      });
    }
  }
  return markers;
}

export function extractTokenAndNumbers(str: string) {
  const regex = /\((\d+):(\d+)\)$/;
  const match = str.match(regex);
  if (match) {
    const extracted = {
      token: match[0],
      line: parseInt(match[1]),
      column: parseInt(match[2]),
    };
    return extracted;
  } else {
    return null;
  }
}

export function cratedFakeNodeError(position: any) {
  return {
    node: {
      loc: {
        start: position,
        end: position,
      },
    },
  } as any;
}
