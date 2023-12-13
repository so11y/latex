import { CallExpression, LogicalExpression, BinaryExpression } from "acorn";
import { AstType } from "./types";
import { LogicalOperators, isLogicalOperators, isSafeOperators } from "../util";
import { LatexValidateConfig, LatexCallConfig } from "./latexConfig";

const ErrorMessage: Array<string> = [
  `只能是使用逻辑表达式符号 ${LogicalOperators.join(" ")}`,
  "真结果需要是函数调用并且不能再返回逻辑表达式了",
  "真结果需要是函数调用并且不能再返回逻辑表达式了",
  `不支持在直接嵌套Conditional函数,但是可以在搭配逻辑表达式使用`,
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

const ConditionalCallAccept = [
  {
    validate(node: LogicalExpression | BinaryExpression | CallExpression) {
      if (
        node.type === AstType.CallExpression &&
        (node as any).callee.name === "Conditional"
      ) {
        return {
          test: false,
          message: ErrorMessage[3],
        };
      }
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

export default {
  name: "If",
  astName: "Conditional",
  alias: "条件",
  config: {
    accept: ConditionalCallAccept,
  },
} as Required<LatexCallConfig>;
