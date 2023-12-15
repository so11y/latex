import { BinaryExpressionDefine } from "./analysisAst/binaryExpression";
import { CallExpressionDefine } from "./analysisAst/callExpression";
import * as monaco from "monaco-editor";
import { ConditionalExpressionDefine } from "./analysisAst/conditionalExpression";
import { ExpressionStatementDefine } from "./analysisAst/expressionStatement";
import { IdentifierDefine } from "./analysisAst/identifier";
import { LiteralDefine } from "./analysisAst/literal";
import { LogicalExpressionDefine } from "./analysisAst/logicalExpression";
import { NumberLiteralDefine } from "./analysisAst/numberLiteral";
import { ProgramDefine } from "./analysisAst/program";
import { AstType, ValidateDefineBase, ValidateGuardFalseMate } from "./types";
import { parse } from "./parse";
import { Program } from "acorn";
import { CallExpression, Node } from "estree";
import {
  cratedFakeNodeError,
  extractTokenAndNumbers,
  nomadizeMarkers,
} from "./util/functional";
import { LatexNames, macroLatexCallConfig } from "./helper/latexConfig";
import { walk } from "estree-walker";

export class Latex {
  static instance: Latex;

  static getInstance() {
    //测试的情况下，每次都会创建新的实例
    if (!Latex.instance || __Test__) {
      Latex.instance = new Latex();
    }
    return Latex.instance;
  }

  declare syntax: {
    mappings: Map<string, ValidateDefineBase>;
    typeKeys: string[];
  };

  ast: Program | null = null;

  hintsCallExpressionNodes: Array<CallExpression> = [];

  constructor() {
    this.syntax = buildTypeNames([
      CallExpressionDefine,
      ExpressionStatementDefine,
      IdentifierDefine,
      LiteralDefine,
      ProgramDefine,
      BinaryExpressionDefine,
      LogicalExpressionDefine,
      ConditionalExpressionDefine,
      NumberLiteralDefine,
    ]);
  }

  validate(value: string, ast?: Program | null) {
    const diagnosisNodes: Array<ValidateGuardFalseMate> = [];
    try {
      this.ast =
        ast ||
        parse.parse(value, {
          ecmaVersion: "latest",
          sourceType: "script",
          locations: true,
        });

      this.walk(this.ast as Node, diagnosisNodes);
    } catch (error) {
      if (diagnosisNodes.length === 0) {
        const position = extractTokenAndNumbers((error as Error).message);
        if (position) {
          diagnosisNodes.push(cratedFakeNodeError(position));
        }
      }
      console.log("ignore parse error");
    }
    if (diagnosisNodes.length !== 0) {
      this.ast = null;
    }
    return {
      diagnosisNodes,
      ast: this.ast,
    };
  }

  walk(ast: Node, diagnosisNodes: Array<ValidateGuardFalseMate>) {
    const _this = this;
    walk(ast as any, {
      enter(node, parent, prop, index) {
        _this.isNeedInlayHints(node);
        const schemas = _this.syntax.mappings.get(node.type)!;
        const validate = schemas.validate(node, parent, prop, index);
        if (validate.through === false) {
          diagnosisNodes.push(validate);
          this.skip();
          return;
        }
        if (validate.through === true && validate.eatKeys) {
          validate.eatKeys.forEach((key) => {
            const nestAst = (node as any)[key];
            if (Array.isArray(nestAst)) {
              (nestAst as Array<Node>).forEach((node) => {
                node.isEat = true;
              });
            } else {
              (nestAst as Node).isEat = true;
            }
          });
        }
      },
      leave(node) {
        if (!_this.syntax.typeKeys.includes(node.type) && !!node.isEat) {
          diagnosisNodes.push({
            node: node as Node,
            through: false,
          });
          this.skip();
          return;
        }
      },
    });
  }

  isNeedInlayHints(node: Node) {
    //提供編輯器類型的嵌入提示
    this.hintsCallExpressionNodes = [];
    if (
      node.type === AstType.CallExpression &&
      node.callee.type === AstType.Identifier
    ) {
      if (LatexNames.includes(node.callee.name)) {
        this.hintsCallExpressionNodes.push(node as CallExpression);
      }
    }
    if (node.type === AstType.ConditionalExpression) {
      this.hintsCallExpressionNodes.push({
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

  getMarkers(value: string, ast?: Program | null) {
    let { diagnosisNodes } = this.validate(value, ast);
    const markers: monaco.editor.IMarkerData[] = nomadizeMarkers(
      diagnosisNodes,
      []
    );
    return {
      ast: this.ast,
      markers,
    };
  }
}

function buildTypeNames(
  types: Array<Array<ValidateDefineBase> | ValidateDefineBase>
) {
  const mappings: Map<string, ValidateDefineBase> = new Map();

  for (const value of types) {
    let current: ValidateDefineBase = value as ValidateDefineBase;
    mappings.set(current.type, current);
  }

  return {
    mappings,
    typeKeys: Array.from(mappings.keys()),
  };
}
