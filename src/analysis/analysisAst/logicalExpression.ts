import { LogicalExpression, Node } from "estree";
import {
  ValidateGuardMateWhere,
  ValidateDefineBase,
  cratedFalseThrough,
  cratedTrueThrough,
} from "../types";
import { validateIsLogicalNode } from "./conditionalExpression";
import { ErrorMessage } from "../helper/errorMessage";

export const LogicalExpressionDefine: ValidateDefineBase = {
  type: "LogicalExpression",
  validate(node: LogicalExpression) {
    const { left, right } = node;

    const handleErrorNode = (node: Node) => {
      if (validateIsLogicalNode(node) === true) {
        return;
      }
      return cratedFalseThrough(
        node,
        ErrorMessage.LogicalExpression.OnlyLogical
      );
    };

    return ValidateGuardMateWhere({
      falseMateGuard: [handleErrorNode(left), handleErrorNode(right)].find(
        Boolean
      ),
      trueMateGuard: cratedTrueThrough(node, ["left", "right"]),
    });
  },
};
