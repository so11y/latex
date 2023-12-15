import { LogicalExpression, Node } from "estree";
import { ValidateSchemaBase, cratedNotThrough } from "../types";
import { validateIsLogicalNode } from "./conditionalExpression";
import { ErrorMessage } from "../helper/errorMessage";

export const LogicalExpressionSchema: ValidateSchemaBase = {
  type: "LogicalExpression",
  validate(node: LogicalExpression) {
    const { left, right } = node;

    const handleErrorNode = (node: Node) => {
      if (validateIsLogicalNode(node) === true) {
        return;
      }
      return cratedNotThrough(node, ErrorMessage.LogicalExpression.OnlyLogical);
    };

    return [handleErrorNode(left), handleErrorNode(right)].find(Boolean);
  },
};
