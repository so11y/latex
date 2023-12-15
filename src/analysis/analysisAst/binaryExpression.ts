import { BinaryExpression, Node } from "estree";
import {
  ValidateGuardMateWhere,
  AstType,
  ValidateDefineBase,
  cratedFalseThrough,
  cratedTrueThrough,
} from "../types";
import { ErrorMessage } from "../helper/errorMessage";
import { isSafeOperators } from "../helper/defineOperators";

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
    return cratedFalseThrough(node, ErrorMessage.BinaryExpression.EqNumberOrCall);
  }
}
export const BinaryExpressionDefine: ValidateDefineBase = {
  type: "BinaryExpression",
  validate(node: BinaryExpression) {
    const { left, right } = node;

    const { through, message } = isSafeOperators(node.operator);
    if (through === false) {
      return cratedFalseThrough(node, message!);
    }
    const falseMateGuard = [maybeErrorNode(left), maybeErrorNode(right)].find(
      Boolean
    );
    return ValidateGuardMateWhere({
      falseMateGuard,
      trueMateGuard: cratedTrueThrough(node, ["left", "right"]),
    });
  },
};
