import { Node } from "estree";
import { AstType, ValidateSchemaGuardMate } from "../types";
import { operators } from "../helper/defineOperators";
import { ErrorMessage } from "../helper/errorMessage";

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

export function isSafeOperators(operator: string) {
  if (!operators[operator as keyof typeof operators]) {
    return {
      through: false,
      message: ErrorMessage.Unknown.UnknownOperator,
    };
  }
  return {
    through: true,
  };
}

export function isLogicalOperators(operator: string) {
  return (
    operators[operator as keyof typeof operators]?.name ===
    AstType.LogicalExpression
  );
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
