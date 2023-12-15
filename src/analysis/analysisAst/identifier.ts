import { LatexNames } from "../helper/latexConfig";
import {
  AstType,
  ValidateGuardMateWhere,
  ValidateDefineBase,
  cratedFalseThrough,
  cratedTrueThrough,
} from "../types";
import { Identifier } from "estree";
import { ErrorMessage, formatterError } from "../helper/errorMessage";

export const IdentifierDefine: ValidateDefineBase = {
  type: "Identifier",
  validate(node: Identifier, parent) {
    const maybeKnow = LatexNames.includes(node.name);
    const parentIsCallExpression =
      !!parent && AstType.CallExpression === parent.type;

    function handleMessage() {
      if (maybeKnow === false) {
        return ErrorMessage.Unknown.UnknownIdentifier;
      }
      if (parentIsCallExpression === false) {
        return formatterError`${ErrorMessage.Identifier.CallKeyCode} ${node.name}`;
      }
      return ErrorMessage.Unknown.UnknownIdentifier;
    }

    let falseMateGuard = undefined;

    if ([maybeKnow, parentIsCallExpression].some((item) => item === false)) {
      falseMateGuard = cratedFalseThrough(node, handleMessage());
    }

    return ValidateGuardMateWhere({
      falseMateGuard,
      trueMateGuard: cratedTrueThrough(node),
    });
  },
};
