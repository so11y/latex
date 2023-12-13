import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { parse } from "acorn";
import { extractTokenAndNumbers } from "../util";
import { ValidateSchemaGuardMate } from "./types";
import { validateWalk } from "./validate";

export function handleValidate(value: string, model: monaco.editor.ITextModel) {
  const { diagnosisNodes } = validate(value);
  const markers = diagnosisNodes.map((node) => {
    const { loc } = node.node;
    return {
      message: node.message ?? "未知字符",
      severity: monaco.MarkerSeverity.Error,
      startLineNumber: loc!.start.line,
      startColumn: loc!.start.column,
      endLineNumber: loc!.end.line,
      endColumn: loc!.end.column,
    };
  });

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
      const loc = extractTokenAndNumbers((error as Error).message);
      if (loc) {
        const { firstNumber, secondNumber } = loc;
        const postion = {
          line: firstNumber,
          column: secondNumber,
        };
        diagnosisNodes.push({
          node: {
            loc: {
              start: postion,
              end: postion,
            },
          },
        } as any);
      }
    }
    console.log("ignore parse error");
  }
  return {
    diagnosisNodes,
  };
}

// const validateType: Record<
//   string,
//   (node: any, parent: any, prop: string, index: number) => ValidateTypeResult
// > = {
//   ExpressionStatement(node: Node, parent: Node) {
//     return {
//       node,
//       through: parent.type === "Program",
//       message: "-----------",
//     };
//   },
//   BinaryExpression(node: Node) {
//     return {
//       node,
//       through: true,
//       message: null,
//     };
//   },
//   CallExpression(node: Node) {
//     return {
//       node,
//       through: true,
//       message: null,
//     };
//   },
//   Program: throwNode,
//   Identifier(node: Identifier, parent: Node) {
//     const maybeKnow = latexNames.includes(node.name);
//     const parentIsCallExpression = parent.type === "CallExpression";
//     function handleMessage() {
//       if (maybeKnow && parentIsCallExpression) {
//         return null;
//       }
//       if (maybeKnow === false) {
//         return "未知字符";
//       }
//       if (parentIsCallExpression === false) {
//         return `需要调用函数方式书写${node.name}(word)`;
//       }
//       return "未知字符";
//     }
//     return {
//       message: handleMessage(),
//       through: maybeKnow && parentIsCallExpression,
//       node,
//     };
//   },
//   NumericLiteral: throwNode,
//   Literal: throwNode,
// };
