import { AstType, ValidateSchemaBase, cratedNotThrough } from "../types";
import { Literal, Node } from "estree"
import { CallExpressionSchema } from "./callExpression";
import { BinaryExpressionSchema } from "./binaryExpression";
import { isString, isNumber } from "lodash-es";

export type LiteralSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "Literal";
};

export const LiteralSchema: LiteralSchemeType = {
  type: "Literal",
  validate(node: Literal, parent: Node) {
    const parentNotIsCallExpression =
      !!parent && parent.type !== CallExpressionSchema.type;
    const parentNotIsBinaryExpression =
      !!parent && parent.type !== BinaryExpressionSchema.type;

    if (isString(node.value) && parentNotIsCallExpression) {
      return cratedNotThrough(node, "字符串只能出现在调用里");
    }

    if (isNumber(node.value)) {
      if (parent.type === AstType.ConditionalExpression) {
        return;
      }

      if (parentNotIsBinaryExpression) {
        return cratedNotThrough(node, "数字需要与运算符号配合");
      }
    }
  },
};
