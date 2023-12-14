import { Node, ConditionalExpression, BinaryExpression } from "estree";
import { AstType, ValidateSchemaGuardMate, cratedNotThrough } from "../types";
import {
  LogicalOperators,
  isLogicalOperators,
  isSafeOperators,
} from "../../util";

import { ValidateSchemaBase } from "../types";

export type ConditionalExpressionSchemeType = Omit<
  ValidateSchemaBase,
  "type"
> & {
  type: "ConditionalExpression";
};

const ErrorMessage: Array<string> = [
  `只能是使用三元和逻辑表达式符号 ${LogicalOperators.join(" ")}`,
  "真结果需要是函数调用并且不能再返回逻辑表达式了",
  "假结果需要是函数调用并且不能再返回逻辑表达式了",
  `不支持在直接嵌套Conditional函数和三元表达式,但是可以在搭配逻辑表达式使用`,
];

function trueAndFalseResult(
  node: Node,
  message: string
): true | ValidateSchemaGuardMate {
  if (node.type !== AstType.CallExpression) {
    return {
      through: false,
      node,
      message,
    };
  }
  return true;
}

//LogicalExpression | BinaryExpression | CallExpression
export function validateIsLogicalNode(
  node: Node
): true | ValidateSchemaGuardMate {
  const notLogicOrBinaryOrConditional = [
    AstType.BinaryExpression,
    AstType.LogicalExpression,
    AstType.ConditionalExpression,
  ].every((type) => node.type !== type);

  if (notLogicOrBinaryOrConditional) {
    return {
      through: false,
      node,
      message: ErrorMessage[0],
    };
  }

  if (AstType.BinaryExpression === node.type) {
    const { through, message } = isSafeOperators(
      (node as BinaryExpression).operator
    );
    if (through === false) {
      return {
        through: false,
        node,
        message: message!,
      };
    }
    //如果是二元表达式那么它的操作符必须是逻辑表达式
    if (isLogicalOperators((node as BinaryExpression).operator) === false) {
      return {
        through: false,
        node,
        message: ErrorMessage[0],
      };
    }
  }

  return true;
}

export const ConditionalExpressionSchema: ConditionalExpressionSchemeType = {
  type: "ConditionalExpression",
  validate(node: ConditionalExpression) {
    const { test, consequent, alternate } = node;

    if (![test, consequent, alternate].every(Boolean)) {
      return cratedNotThrough(node, "需要三个参数");
    }

    const errorNodes = [
      validateIsLogicalNode(test),
      trueAndFalseResult(consequent, ErrorMessage[1]),
      trueAndFalseResult(alternate, ErrorMessage[2]),
    ]
      .map((result) => {
        return result === true
          ? null
          : cratedNotThrough(result.node, result.message!);
      })
      .filter(Boolean) as Array<ValidateSchemaGuardMate<Node>>;

    if (errorNodes.length) {
      return cratedNotThrough(node, null, errorNodes);
    }
  },
};
