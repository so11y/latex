import { LogicalExpression, Node } from "estree";
import { ValidateSchemaBase, cratedNotThrough } from "../types";
import { validateIsLogicalNode } from "./conditionalExpression";
export type LogicalExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "LogicalExpression";
};

export const LogicalExpressionSchema: LogicalExpressionSchemeType = {
  type: "LogicalExpression",
  validate(node: LogicalExpression) {
    const { left, right } = node;

    const handleErrorNode = (node: Node) => {
      if (validateIsLogicalNode(node) === true) {
        return;
      }
      return cratedNotThrough(
        node,
        "逻辑表达式两边需要是条件表达式 使用 && 或者 || 连接 "
      );
    };

    return [handleErrorNode(left), handleErrorNode(right)].find(Boolean);
  },
};
