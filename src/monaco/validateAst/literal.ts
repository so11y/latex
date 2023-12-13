import { ValidateSchemaBase, cratedNotThrough } from "./types";
import { CallExpression, Literal, Node } from "acorn";
import { CallExpressionSchema, validateCalleeName } from "./callExpression";
import { BinaryExpressionSchema } from "./binaryExpression";
import { LatexCallConfig } from "./latexConfig";
import { isString, isNumber } from "lodash-es"

export type LiteralSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "Literal";
};

export const LiteralSchema: LiteralSchemeType = {
  type: "Literal",
  validate(node: Literal, parent: Node, _, index) {
    const parentNotIsCallExpression =
      !!parent && parent.type !== CallExpressionSchema.type;
    const parentNotIsBinaryExpression =
      !!parent && parent.type !== BinaryExpressionSchema.type;

    if (isString(node.value) && parentNotIsCallExpression) {
      return cratedNotThrough(node, "字符串只能出现在调用里");
    }

    if (isNumber(node.value)) {
      const parentIsCall = parentNotIsCallExpression === false;

      if (parentIsCall) {
        const parentIsConditional = validateCalleeName(
          (parent as CallExpression).callee,
          [LatexCallConfig.Conditional.astName || ""]
        );
        if (index && index > 0 && parentIsCall && parentIsConditional.through) {
          return;
        }
      }

      if (parentNotIsBinaryExpression) {
        return cratedNotThrough(node, "数字需要与运算符号配合");
      }
    }
  },
};
