import { ValidateSchemaBase } from "./types";
export type BinaryExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "BinaryExpression";
};

export const BinaryExpressionSchema: BinaryExpressionSchemeType = {
  type: "BinaryExpression",
  validate(node, parent, prop, index) {
    return {
      node,
      through: true,
      message: "",
    };
  },
};
