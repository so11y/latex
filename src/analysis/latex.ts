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
import { CallExpression, Node } from "estree";
import {
  buildTypeNames,
  cratedFakeNodeError,
  extractTokenAndNumbers,
  nomadizeMarkers,
} from "./util/functional";
import {
  LatexConfig,
  LatexValidateAccept,
  macroLatexCallConfig,
} from "./helper/latexConfig";
import { walk } from "estree-walker";
import { Node as AcornNode } from "acorn";
import { isString } from "lodash-es";

interface LatexSyntax {
  mappings: Map<string, ValidateDefineBase>;
  typeKeys: string[];
}

export class Latex {
  static instance: Latex;

  static getInstance() {
    //测试的情况下，每次都会创建新的实例
    if (!Latex.instance || __Test__) {
      Latex.instance = new Latex(
        buildTypeNames([
          CallExpressionDefine,
          ExpressionStatementDefine,
          IdentifierDefine,
          LiteralDefine,
          ProgramDefine,
          BinaryExpressionDefine,
          LogicalExpressionDefine,
          ConditionalExpressionDefine,
          NumberLiteralDefine,
        ])
      );
    }
    return Latex.instance;
  }

  declare syntax: LatexSyntax;

  LatexConfig = new LatexConfig();

  ast: AcornNode | null = null;

  hintsCallExpressionNodes: Array<CallExpression> = [];

  constructor(syntax: LatexSyntax) {
    this.syntax = syntax;
  }

  fork(syntax: LatexSyntax, ast: AcornNode) {
    return new ForkLatex(syntax).validate(null, ast);
  }

  validate(value: string | null, ast?: AcornNode | null) {
    const diagnosisNodes: Array<ValidateGuardFalseMate> = [];
    if (isString(value) && value.length === 0) {
      return {
        diagnosisNodes,
        ast: null,
      };
    }

    try {
      if (ast) {
        this.ast = ast;
      } else if (value) {
        this.ast = parse.parse(value, {
          ecmaVersion: "latest",
          sourceType: "script",
          locations: true,
        });
      } else {
        throw new Error("value or ast must be provided");
      }

      this.walk(this.ast as Node, diagnosisNodes);
    } catch (error) {
      if (diagnosisNodes.length === 0) {
        const position = extractTokenAndNumbers((error as Error).message);
        if (position) {
          diagnosisNodes.push(cratedFakeNodeError(position));
        } else {
          console.error(error);
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
    this.hintsCallExpressionNodes = [];
    walk(ast as any, {
      enter(node, parent, prop, index) {
        _this.isNeedInlayHints(node);
        const define = _this.syntax.mappings.get(node.type)!;
        const validate = define.validate.call(_this, node, parent, prop, index);
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

        if (validate.isBreak) {
          this.skip();
          return;
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
    if (
      node.type === AstType.CallExpression &&
      node.callee.type === AstType.Identifier
    ) {
      if (this.LatexConfig.LatexNames.includes(node.callee.name)) {
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

  getMarkers(value: string, ast?: AcornNode | null) {
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

export class ForkLatex extends Latex {
  declare currentAcceptConfig: LatexValidateAccept["child"];
  forkValidate(syntax: LatexSyntax, ast: AcornNode) {
    return new Latex(syntax).validate(null, ast);
  }
}
