import { BinaryExpression, Node } from "estree";
import { AstType, ValidateSchemaBase, cratedNotThrough } from "../types";
import { ErrorMessage } from "../helper/errorMessage";
import { isSafeOperators } from "../helper/defineOperators";
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
  if (!validateValues(node)) {
    return cratedNotThrough(
      node,
      ErrorMessage.BinaryExpression.EqNumberOrCall
    );
  }
}
export const BinaryExpressionSchema: BinaryExpressionSchemeType = {
  type: "BinaryExpression",
  validate(node: BinaryExpression) {
    const { left, right } = node;

    const { through, message } = isSafeOperators(node.operator);
    if (through === false) {
      return cratedNotThrough(node, message!);
    }

    return [maybeErrorNode(left), maybeErrorNode(right)].find(Boolean);
  },
};
