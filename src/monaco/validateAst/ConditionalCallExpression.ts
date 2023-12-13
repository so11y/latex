import { CallExpression, LogicalExpression, BinaryExpression } from "acorn";
import { AstType } from "./types";
import { operators } from "../util";
function validateConditional(node: CallExpression) {
  if (node.type !== "CallExpression") {
    return false;
  }
  if (node.arguments.length !== 1) {
    return false;
  }
  return true;
}

export default [
  {
    message:
      "条件表达式需要是二元表达式或者逻辑表达式并且二元表达式的符号必须是逻辑表达式不包含嵌套的三元表达式",
    validate(node: LogicalExpression | BinaryExpression) {
      const notLogicOrBinary = [
        AstType.BinaryExpression,
        AstType.LogicalExpression,
      ].every((type) => node.type !== type);

      if (notLogicOrBinary) {
        return false;
      }

      //如果是二元表达式那么它的操作符必须是逻辑表达式
      if (
        AstType.BinaryExpression === node.type &&
        operators[node.operator as keyof typeof operators].name !==
          AstType.LogicalExpression
      ) {
        return false;
      }
      return true;
    },
  },
  {
    message: "真结果需要是函数调用",
    validate: validateConditional,
  },
  {
    message: "假结果需要是函数调用",
    validate: validateConditional,
  },
];
