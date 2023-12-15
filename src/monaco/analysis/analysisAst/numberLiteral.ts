import { AstType, ValidateSchemaBase, cratedNotThrough } from "../types";
import { Node, NumberLiteral } from "estree";
import { BinaryExpressionSchema } from "./binaryExpression";
import { ErrorMessage } from "../helper/errorMessage";

export const NumberLiteralSchema: ValidateSchemaBase = {
  type: "NumberLiteral",
  validate(node: NumberLiteral, parent: Node) {
    if (parent.type === AstType.ConditionalExpression) {
      return;
    }
    if (parent.type !== BinaryExpressionSchema.type) {
      return cratedNotThrough(
        node,
        ErrorMessage.NumberLiteral.NeedComposeBinary
      );
    }
  },
};
