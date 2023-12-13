import { BinaryExpression, Node } from "acorn";
import { CallExpressionSchema } from "./callExpression";
import { LiteralSchema } from "./literal";
import { ValidateSchemaBase, cratedNotThrough } from "./types";
import { curry, isNumber } from "lodash-es";
import { isSafeOperators, operators } from "../util/index";
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
  //只能是函数调用表达式
  if (CallExpressionSchema.type === node.type) {
    return true;
  }
}
function maybeErrorNode(node: Node) {
  const crateErrorMessage = curry(cratedNotThrough)(node);
  if (!validateValues(node)) {
    return crateErrorMessage("运算两边需要是数值或者函数调用表达式或者运算");
  }
}
export const BinaryExpressionSchema: BinaryExpressionSchemeType = {
  type: "BinaryExpression",
  validate(node: BinaryExpression) {
    const { left, right } = node;
    const crateErrorMessage = curry(cratedNotThrough)(node);

    const { test, message } = isSafeOperators(node.operator);
    if (!test) {
      return crateErrorMessage(message);
    }

    return [maybeErrorNode(left), maybeErrorNode(right)].find(Boolean);
  },
};
