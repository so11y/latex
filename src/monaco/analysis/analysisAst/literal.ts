import { ValidateSchemaBase, cratedNotThrough } from "../types";
import { Literal, Node } from "estree";
import { CallExpressionSchema } from "./callExpression";
import { ErrorMessage } from "../helper/errorMessage";

export type LiteralSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "Literal";
};

export const LiteralSchema: LiteralSchemeType = {
  type: "Literal",
  validate(node: Literal, parent: Node) {
    if (parent.type !== CallExpressionSchema.type) {
      return cratedNotThrough(node, ErrorMessage.Literal.OnlyInCall);
    }
  },
};
