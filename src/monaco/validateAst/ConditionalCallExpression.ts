import { CallExpression, LogicalExpression, BinaryExpression } from "acorn";
import { AstType } from "./types";
import { isLogicalOperators, isSafeOperators } from "../util";
import { LatexValidateConfig } from "./latexConfig";
const ErrorMessage = [
  "条件表达式需要是二元表达式或者逻辑表达式并且二元表达式的符号必须是逻辑表达式并且不能再继续嵌套三元表达式",
  "真结果需要是函数调用并且不能再返回逻辑表达式了",
  "真结果需要是函数调用并且不能再返回逻辑表达式了",
];
function validateConditional(node: CallExpression) {
  if (node.type !== "CallExpression") {
    return false;
  }
  if (node.arguments.length !== 1) {
    return false;
  }
  return true;
}

function trueAndFalseResult(node: CallExpression, message: string) {
  const test = validateConditional(node);
  if (test === false) {
    return {
      test: false,
      message,
    };
  }
  return true;
}

export default [
  {
    validate(node: LogicalExpression | BinaryExpression) {
      const notLogicOrBinary = [
        AstType.BinaryExpression,
        AstType.LogicalExpression,
      ].every((type) => node.type !== type);

      if (notLogicOrBinary) {
        return {
          test: false,
          message: ErrorMessage[0],
        };
      }

      if (AstType.BinaryExpression === node.type) {
        const { test, message } = isSafeOperators(node.operator);
        if (test === false) {
          return {
            test: false,
            message,
          };
        }
        //如果是二元表达式那么它的操作符必须是逻辑表达式
        if (isLogicalOperators(node.operator) === false) {
          return {
            test: false,
            message: ErrorMessage[0],
          };
        }
      }

      return true;
    },
  },
  {
    validate(node: CallExpression) {
      return trueAndFalseResult(node, ErrorMessage[1]);
    },
  },
  {
    validate(node: CallExpression) {
      return trueAndFalseResult(node, ErrorMessage[2]);
    },
  },
] as Array<LatexValidateConfig>;
