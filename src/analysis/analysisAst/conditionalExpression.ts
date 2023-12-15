import { Node, ConditionalExpression, BinaryExpression } from "estree";
import { AstType, ValidateSchemaGuardMate, cratedNotThrough } from "../types";

import { ValidateSchemaBase } from "../types";
import { ErrorMessage, formatterError } from "../helper/errorMessage";
import {
  LogicalOperators,
  isLogicalOperators,
  isSafeOperators,
} from "../helper/defineOperators";

function trueAndFalseResult(
  node: Node,
  message: string
): true | ValidateSchemaGuardMate {
  if (node.type !== AstType.CallExpression) {
    return cratedNotThrough(node, message);
  }
  return true;
}

//LogicalExpression | BinaryExpression | CallExpression
export function validateIsLogicalNode(
  node: Node
): true | ValidateSchemaGuardMate {
  if (node.type === AstType.ConditionalExpression) {
    return cratedNotThrough(
      node,
      ErrorMessage.ConditionalExpression.NotNestConditionalExpression
    );
  }

  const notLogicOrBinary = [
    AstType.BinaryExpression,
    AstType.LogicalExpression,
  ].every((type) => node.type !== type);

  if (notLogicOrBinary) {
    return cratedNotThrough(
      node,
      formatterError`${
        ErrorMessage.ConditionalExpression.OnlyLogical
      } ${LogicalOperators.join(" ")}`
    );
  }

  if (AstType.BinaryExpression === node.type) {
    const { through, message } = isSafeOperators(
      (node as BinaryExpression).operator
    );
    if (through === false) {
      return cratedNotThrough(node, message!);
    }
    //如果是二元表达式那么它的操作符必须是逻辑表达式
    if (isLogicalOperators((node as BinaryExpression).operator) === false) {
      return cratedNotThrough(
        node,
        ErrorMessage.ConditionalExpression.OnlyLogical
      );
    }
  }

  return true;
}

export const ConditionalExpressionSchema: ValidateSchemaBase = {
  type: "ConditionalExpression",
  validate(node: ConditionalExpression) {
    const { test, consequent, alternate } = node;

    if (![test, consequent, alternate].every(Boolean)) {
      return cratedNotThrough(node, "需要三个参数");
    }

    const errorNodes = [
      validateIsLogicalNode(test),
      trueAndFalseResult(
        consequent,
        ErrorMessage.ConditionalExpression.OnlyTrueCall
      ),
      trueAndFalseResult(
        alternate,
        ErrorMessage.ConditionalExpression.OnlyFalseCall
      ),
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
