import * as monaco from "monaco-editor";
import { Program } from "acorn";
import { extractTokenAndNumbers } from "./util";
import { ValidateSchemaGuardMate } from "./types";
import { validateWalk } from "./validate";
import { Node } from "estree";
import { parse } from "./parse";

export function handleValidate(value: string, model: monaco.editor.ITextModel) {
  let { ast, diagnosisNodes } = validate(value);
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
          severity: node.severity ?? monaco.MarkerSeverity.Error,
          startLineNumber: loc!.start.line,
          startColumn: loc!.start.column + 1,
          endLineNumber: loc!.end.line,
          endColumn: loc!.end.column + 1,
        });
      }
    }
  }
  if (markers.length) {
    ast = null;
  }
  monaco.editor.setModelMarkers(model, "owner", markers);
  return {
    ast,
  };
}

export function validate(value: string) {
  const diagnosisNodes: Array<ValidateSchemaGuardMate> = [];
  let ast: Program | null = null;
  try {
    ast = parse.parse(value, {
      ecmaVersion: "latest",
      sourceType: "script",
      locations: true,
    });
    validateWalk(ast as Node, diagnosisNodes);
  } catch (error) {
    if (diagnosisNodes.length === 0) {
      const position = extractTokenAndNumbers((error as Error).message);
      if (position) {
        diagnosisNodes.push(cratedFakeNodeError(position));
      }
    }
    console.log("ignore parse error");
  }
  return {
    diagnosisNodes,
    ast,
  };
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
