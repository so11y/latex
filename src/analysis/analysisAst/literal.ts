import {
  ValidateGuardMateWhere,
  ValidateDefineBase,
  cratedFalseThrough,
  cratedTrueThrough,
} from "../types";
import { Literal, Node } from "estree";
import { CallExpressionDefine } from "./callExpression";
import { ErrorMessage } from "../helper/errorMessage";

export const LiteralDefine: ValidateDefineBase = {
  type: "Literal",
  validate(node: Literal, parent: Node) {
    let falseMateGuard = undefined;
    if (parent.type !== CallExpressionDefine.type) {
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
