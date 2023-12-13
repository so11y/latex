import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { parse } from "acorn";
import { extractTokenAndNumbers } from "../util";
import { ValidateSchemaGuardMate } from "./types";
import { validateWalk } from "./validate";
import { Node } from "acorn";

export function handleValidate(value: string, model: monaco.editor.ITextModel) {
  const diagnosisNodes = validate(value);
  const markers: monaco.editor.IMarkerData[] = [];
  nomadizeMarkers(diagnosisNodes);
  function nomadizeMarkers(nodes: ValidateSchemaGuardMate<Node>[]) {
    for (const node of nodes) {
      if (node.errorNodes?.length) {
        nomadizeMarkers(node.errorNodes);
      } else {
        const { loc } = node.node;
        markers.push({
          message: node.message ?? "未知字符",
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: loc!.start.line,
          startColumn: loc!.start.column + 1,
          endLineNumber: loc!.end.line,
          endColumn: loc!.end.column + 1,
        });
      }
    }
  }
  monaco.editor.setModelMarkers(model, "owner", markers);
}

function validate(value: string) {
  const diagnosisNodes: Array<ValidateSchemaGuardMate> = [];
  try {
    const ast = parse(value, {
      ecmaVersion: "latest",
      sourceType: "script",
      locations: true,
    });
    validateWalk(ast, diagnosisNodes);
  } catch (error) {
    if (diagnosisNodes.length === 0) {
      const position = extractTokenAndNumbers((error as Error).message);
      if (position) {
        diagnosisNodes.push(cratedFakeNodeError(position));
      }
    }
    console.log("ignore parse error");
  }
  return diagnosisNodes;
}

function cratedFakeNodeError(position: any) {
  return {
    node: {
      loc: {
        start: position,
        end: position,
      },
    },
  } as any;
}
