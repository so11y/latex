import { ValidateSchemaBase } from "./types";
import { Literal } from "acorn";

export type LiteralSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "Literal";
};

export const LiteralSchema: LiteralSchemeType = {
  type: "Literal",
  validate(node: Literal, parent) {
    return {
      message: null,
      through: true,
      node,
    };
  },
};
