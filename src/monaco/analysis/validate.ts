import { CallExpressionSchema } from "./analysisAst/callExpression";
import { ExpressionStatementSchema } from "./analysisAst/expressionStatement";
import { IdentifierSchema } from "./analysisAst/identifier";
import { LiteralSchema } from "./analysisAst/literal";
import { ProgramSchema } from "./analysisAst/program";
import { BinaryExpressionSchema } from "./analysisAst/binaryExpression";
import { LogicalExpressionSchema } from "./analysisAst/logicalExpression";
import { ConditionalExpressionSchema } from "./analysisAst/conditionalExpression";
import { NumberLiteralSchema } from "./analysisAst/numberLiteral";
import { Node, CallExpression } from "estree";
import { walk } from "estree-walker";
import { Program } from "acorn";
import { AstType, ValidateSchemaBase, ValidateSchemaGuardMate } from "./types";
import { LatexNames, macroLatexCallConfig } from "./helper/latexConfig";
import { extractTokenAndNumbers } from "./util";
import { parse } from "./parse";

function buildTypeNames(
  types: Array<Array<ValidateSchemaBase> | ValidateSchemaBase>
) {
  const mappings: Map<string, ValidateSchemaBase> = new Map();

  for (const value of types) {
    let current: ValidateSchemaBase = value as ValidateSchemaBase;
    mappings.set(current.type, current);
  }

  return {
    mappings,
    typeKeys: Array.from(mappings.keys()),
  };
}

const { typeKeys, mappings } = buildTypeNames([
  CallExpressionSchema,
  ExpressionStatementSchema,
  IdentifierSchema,
  LiteralSchema,
  ProgramSchema,
  BinaryExpressionSchema,
  LogicalExpressionSchema,
  ConditionalExpressionSchema,
  NumberLiteralSchema,
]);

let hintsCallExpressionNodes: Array<CallExpression> = [];
export function getCallExpressionNodes() {
  return hintsCallExpressionNodes;
}

function isNeedInlayHints(node: Node) {
  //提供編輯器類型的嵌入提示
  if (
    node.type === AstType.CallExpression &&
    node.callee.type === AstType.Identifier
  ) {
    if (LatexNames.includes(node.callee.name)) {
      hintsCallExpressionNodes.push(node as CallExpression);
    }
  }
  if (node.type === AstType.ConditionalExpression) {
    hintsCallExpressionNodes.push({
      type: AstType.CallExpression,
      loc: node.loc,
      optional: false,
      callee: {
        type: AstType.Identifier,
        loc: null,
        name: macroLatexCallConfig.Conditional.name,
      },
      arguments: [node.test, node.consequent, node.alternate].filter(Boolean),
    });
  }
}

export function validateWalk(
  ast: Node,
  diagnosisNodes: Array<ValidateSchemaGuardMate>
) {
  hintsCallExpressionNodes = [];
  walk(ast as any, {
    enter(node, parent, prop, index) {
      isNeedInlayHints(node);
      if (!typeKeys.includes(node.type)) {
        diagnosisNodes.push({
          node: node as Node,
          through: false,
        });
        this.skip();
        return;
      }
      const schemas = mappings.get(node.type)!;
      const validate = schemas.validate(node, parent, prop, index);
      if (validate && validate.through === false) {
        diagnosisNodes.push(validate);
        this.skip();
      }
    },
  });
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
