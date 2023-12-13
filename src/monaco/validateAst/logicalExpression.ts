import { LogicalExpression } from "acorn";
import { ValidateSchemaBase, cratedNotThrough } from "./types";
import ConditionalCallAccept from "./ConditionalCallExpression";
import { curry } from "lodash-es";
export type LogicalExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "LogicalExpression";
};

export const LogicalExpressionSchema: LogicalExpressionSchemeType = {
  type: "LogicalExpression",
  validate(node: LogicalExpression) {
    const { left, right } = node;
    const crateErrorMessage = curry(cratedNotThrough)(node);
    const validate = ConditionalCallAccept[0].validate!;
    const leftTest = validate(left, parent);
    const rightTest = validate(right, parent);
    if (leftTest !== true && rightTest !== true) {
      return crateErrorMessage(
        "逻辑表达式两边需要是条件表达式 使用 && 或者 || 连接 "
      );
    }
  },
};
