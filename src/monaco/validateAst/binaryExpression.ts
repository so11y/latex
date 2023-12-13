import { ValidateSchemaBase } from "./types";
import { BinaryExpression } from "acorn";
export type BinaryExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "BinaryExpression";
};

export const BinaryExpressionSchema: BinaryExpressionSchemeType = {
  type: "BinaryExpression",
  validate() {
    return undefined;
  },
};
