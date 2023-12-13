import { LogicalExpression } from "acorn";
import { ValidateSchemaBase, cratedNotThrough } from "./types";
import { LatexCallConfig } from "./latexConfig";
import { curry } from "lodash-es";
export type LogicalExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "LogicalExpression";
};

export const LogicalExpressionSchema: LogicalExpressionSchemeType = {
  type: "LogicalExpression",
  validate(node: LogicalExpression) {
    const { left, right } = node;
    const crateErrorMessage = curry(cratedNotThrough)(node);
    console.log(1);
    const validate = LatexCallConfig.Conditional.config!.accept[0].validate!;
    if (!validate(left, node) && !validate(right, node)) {
      return crateErrorMessage("逻辑表达式两边需要是条件表达式 使用 && 或者 || 连接 ");
    }
  },
};
