import {
  ValidateGuardMateWhere,
  ValidateSchemaBase,
  cratedFalseThrough,
  cratedTrueThrough,
} from "../types";
import { Literal, Node } from "estree";
import { CallExpressionSchema } from "./callExpression";
import { ErrorMessage } from "../helper/errorMessage";

export const LiteralSchema: ValidateSchemaBase = {
  type: "Literal",
  validate(node: Literal, parent: Node) {
    let falseMateGuard = undefined;
    if (parent.type !== CallExpressionSchema.type) {
      falseMateGuard = cratedFalseThrough(
        node,
        ErrorMessage.Literal.OnlyInCall
      );
    }

    return ValidateGuardMateWhere({
      falseMateGuard,
      trueMateGuard: cratedTrueThrough(node),
    });
  },
};
