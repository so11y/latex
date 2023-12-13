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
    message: `参数类型不匹配`,
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
      accept: DefaultAccept as any,
    },
  } = latexConfig;
  const crateErrorMessage = curry(cratedNotThrough)(parent);
  if (n.length !== config.accept.length) {
    return crateErrorMessage(`参数个数不匹配需要${config.accept.length}个参数`);
  }
  //标准化accept参数
  function nomadizeAccept(node: Expression | SpreadElement, index: number) {
    const accept = config.accept[index];
    return {
      node,
      accept,
    };
  }
  //过滤错误的节点
  function filterErrorNodes({
    node,
    accept,
  }: ReturnType<typeof nomadizeAccept>) {
    if (accept.validate) {
      return accept.validate(node, n) === false;
    }
    if (accept?.notCheck !== true) {
      const isSameType = node.type !== accept.type;
      if (isSameType) {
        return true;
      }
      if (accept.literalType) {
        return typeof (node as Literal).value !== accept.literalType;
      }
    }
    return false;
  }
  const errorNodes = n.map(nomadizeAccept).filter(filterErrorNodes);
  if (errorNodes.length) {
    return crateErrorMessage(
      null,
      errorNodes.map(({ node, accept }) => {
        return cratedNotThrough(node, accept.message);
      })
    );
  }
  return cratedThrough(parent);
}

export const CallExpressionSchema: CallExpressionSchemeType = {
  type: "CallExpression",
  validate(node: CallExpression) {
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
