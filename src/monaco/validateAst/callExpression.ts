import {
  ValidateSchemaBase,
  ValidateSchemaGuardMate,
  cratedNotThrough,
  cratedThrough,
} from "./types";
import {
  CallExpression,
  Expression,
  Identifier,
  SpreadElement,
  Super,
  Node,
  Literal,
} from "acorn";
import { curry } from "lodash-es";
import { LiteralSchema } from "./literal";
import { LatexCallConfig, LatexNames } from "./latexConfig";

export type CallExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "CallExpression";
};

const DefaultAccept = [
  {
    type: LiteralSchema.type,
    literalType: "string",
    notCheck: false,
  },
];

export function validateCalleeName(
  n: Expression | Super,
  names = LatexNames
): ValidateSchemaGuardMate<Identifier> {
  const crateErrorMessage = curry(cratedNotThrough)(n);
  if (n.type !== "Identifier") {
    return crateErrorMessage("未知语法调用");
  }
  if (!names.includes(n.name)) {
    return crateErrorMessage("未知调用函数");
  }
  return cratedThrough(n);
}

function validateArguments(
  n: Array<Expression | SpreadElement>,
  parent: Node,
  latexConfig: LatexCallConfig
) {
  const {
    config = {
      accept: DefaultAccept,
    },
  } = latexConfig;
  const crateErrorMessage = curry(cratedNotThrough)(parent);
  if (n.length > config.accept.length) {
    return crateErrorMessage(`只可接受${config.accept.length}个参数`);
  }
  const errorNodes = n.filter((node, index) => {
    const current = config.accept[index];
    if (current?.notCheck !== true) {
      const isSameType = node.type !== current.type;
      if (isSameType) {
        return true;
      }
      if (current.literalType) {
        return typeof (node as Literal).value !== current.literalType;
      }
    }
    return false;
  });
  if (errorNodes.length) {
    return crateErrorMessage(
      null,
      errorNodes.map((node) => {
        return cratedNotThrough(node, `参数类型不匹配`);
      })
    );
  }
  return cratedThrough(parent);
}

export const CallExpressionSchema: CallExpressionSchemeType = {
  type: "CallExpression",
  validate(node: CallExpression, parent: Node, prop, index) {
    const { callee, arguments: _arguments } = node;
    const safeCalleeName = validateCalleeName(callee);
    if (safeCalleeName.through) {
      const config =
        LatexCallConfig[
          safeCalleeName.node.name as keyof typeof LatexCallConfig
        ];
      return validateArguments(_arguments, node, config);
    }
    return safeCalleeName;
  },
};
