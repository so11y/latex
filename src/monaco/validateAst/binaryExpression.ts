import { BinaryExpression, Node } from "acorn";
import { CallExpressionSchema } from "./callExpression";
import { LiteralSchema } from "./literal";
import { ValidateSchemaBase, cratedNotThrough } from "./types";
import { SpecialLatexNames } from "./latexConfig";
import { create, curry, isNumber } from "lodash-es";
export type BinaryExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "BinaryExpression";
};

function validateValues(node: Node) {
  //只能是数字
  if (node.type === LiteralSchema.type && isNumber((node as any).value)) {
    return true;
  }
  //只能是二元表达式
  if (BinaryExpressionSchema.type === node.type) {
    return true;
  }
  //只能是函数调用表达式不包含特殊的latex函数
  if (
    CallExpressionSchema.type === node.type &&
    !SpecialLatexNames.includes((node as any).callee.name)
  ) {
    return true;
  }
}
function maybeErrorNode(node: Node) {
  const crateErrorMessage = curry(cratedNotThrough)(node);
  if (!validateValues(node)) {
    return crateErrorMessage(
      "二元表达式两边需要是数值或者函数调用表达式或者二元表达式"
    );
  }
}
export const BinaryExpressionSchema: BinaryExpressionSchemeType = {
  type: "BinaryExpression",
  validate(node: BinaryExpression) {
    const { left, right } = node;

    return [maybeErrorNode(left), maybeErrorNode(right)].find(Boolean);
  },
};
