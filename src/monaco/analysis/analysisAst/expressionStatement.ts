import { ValidateSchemaBase } from "../types";

export type ExpressionStatementSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "ExpressionStatement";
};

export const ExpressionStatementSchema: ExpressionStatementSchemeType = {
  type: "ExpressionStatement",
  validate(node, parent) {
    return {
      node,
      through: !!parent && parent.type === "Program",
    };
  },
};
