import { AstType, ValidateSchemaBase, cratedNotThrough } from "../types";
import { Node, NumberLiteral } from "estree";
import { BinaryExpressionSchema } from "./binaryExpression";

export type NumberLiteralSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "NumberLiteral";
};

export const NumberLiteralSchema: NumberLiteralSchemeType = {
  type: "NumberLiteral",
  validate(node: NumberLiteral, parent: Node) {
    if (parent.type === AstType.ConditionalExpression) {
      return;
    }
    if (parent.type !== BinaryExpressionSchema.type) {
      return cratedNotThrough(node, "数字需要与运算符号配合");
    }
  },
};
