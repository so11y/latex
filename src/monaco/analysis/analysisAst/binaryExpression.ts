import { BinaryExpression, Node } from "estree";
import { AstType, ValidateSchemaBase, cratedNotThrough } from "../types";
import { curry } from "lodash-es";
import { isSafeOperators } from "../helper/operators";
export type BinaryExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "BinaryExpression";
};

function validateValues(node: Node) {
  //只能是数字
  if (node.type === AstType.NumberLiteral) {
    return true;
  }
  //只能是二元表达式
  if (AstType.BinaryExpression === node.type) {
    return true;
  }
  //只能是函数调用表达式
  if (AstType.CallExpression === node.type) {
    return true;
  }
  //可以是三元表达式,因为三元表达式返回的结果是可以运算
  if (AstType.ConditionalExpression === node.type) {
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

    const { through, message } = isSafeOperators(node.operator);
    if (through === false) {
      return crateErrorMessage(message);
    }

    return [maybeErrorNode(left), maybeErrorNode(right)].find(Boolean);
  },
};
