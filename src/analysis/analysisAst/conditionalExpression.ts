import { Node, ConditionalExpression, BinaryExpression } from "estree";
import {
  AstType,
  ValidateGuardFalseMate,
  ValidateGuardMateWhere,
  cratedFalseThrough,
  cratedTrueThrough,
} from "../types";

import { ValidateDefineBase } from "../types";
import { ErrorMessage, formatterError } from "../helper/errorMessage";
import {
  LogicalOperators,
  isLogicalOperators,
  isSafeOperators,
} from "../helper/defineOperators";

function trueAndFalseResult(
  node: Node,
  message: string
): true | ValidateGuardFalseMate {
  if (node.type !== AstType.CallExpression) {
    return cratedFalseThrough(node, message);
  }
  return true;
}

//LogicalExpression | BinaryExpression | CallExpression
export function validateIsLogicalNode(
  node: Node
): true | ValidateGuardFalseMate {
  if (node.type === AstType.ConditionalExpression) {
    return cratedFalseThrough(
      node,
      ErrorMessage.ConditionalExpression.NotNestConditionalExpression
    );
  }

  const notLogicOrBinary = [
    AstType.BinaryExpression,
    AstType.LogicalExpression,
  ].every((type) => node.type !== type);

  if (notLogicOrBinary) {
    return cratedFalseThrough(
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
      return cratedFalseThrough(node, message!);
    }
    //如果是二元表达式那么它的操作符必须是逻辑表达式
    if (isLogicalOperators((node as BinaryExpression).operator) === false) {
      return cratedFalseThrough(
        node,
        ErrorMessage.ConditionalExpression.OnlyLogical
      );
    }
  }

  return true;
}

export const ConditionalExpressionDefine: ValidateDefineBase = {
  type: "ConditionalExpression",
  validate(node: ConditionalExpression) {
    const { test, consequent, alternate } = node;

    if (![test, consequent, alternate].every(Boolean)) {
      return cratedFalseThrough(node, "需要三个参数");
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
          : cratedFalseThrough(result.node, result.message!);
      })
      .filter(Boolean) as Array<ValidateGuardFalseMate<Node>>;

    return ValidateGuardMateWhere({
      //是可以直接返回errorNodes,但是这样错误的话是一个一个在界面显示
      //这和前置代码设计有关系，把错误节点放置在一个数组中，这样可以一次性的显示
      falseMateGuard: errorNodes.length
        ? cratedFalseThrough(node, null, errorNodes)
        : false,
      trueMateGuard: cratedTrueThrough(node, [
        "test",
        "consequent",
        "alternate",
      ]),
    });
  },
};
