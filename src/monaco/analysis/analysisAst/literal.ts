import { ValidateSchemaBase, cratedNotThrough } from "../types";
import { Literal, Node } from "estree";
import { CallExpressionSchema } from "./callExpression";

export type LiteralSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "Literal";
};

export const LiteralSchema: LiteralSchemeType = {
  type: "Literal",
  validate(node: Literal, parent: Node) {
    if (parent.type !== CallExpressionSchema.type) {
      return cratedNotThrough(node, "字符串只能出现在调用里");
    }
  },
};
