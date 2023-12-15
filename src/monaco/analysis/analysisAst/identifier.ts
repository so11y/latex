import { CallExpressionSchema } from "./callExpression";
import { LatexNames } from "../helper/latexConfig";
import { ValidateSchemaBase } from "../types";
import { Identifier } from "estree";
import { ErrorMessage, formatterError } from "../helper/errorMessage";

export const IdentifierSchema: ValidateSchemaBase = {
  type: "Identifier",
  validate(node: Identifier, parent) {
    const maybeKnow = LatexNames.includes(node.name);
    const parentIsCallExpression =
      !!parent && CallExpressionSchema.type === parent.type;
    function handleMessage() {
      if (maybeKnow && parentIsCallExpression) {
        return null;
      }
      if (maybeKnow === false) {
        return ErrorMessage.Unknown.UnknownIdentifier;
      }
      if (parentIsCallExpression === false) {
        return formatterError`${ErrorMessage.Identifier.CallKeyCode} ${node.name}`;
      }
      return ErrorMessage.Unknown.UnknownIdentifier;
    }
    return {
      message: handleMessage(),
      through: maybeKnow && parentIsCallExpression,
      node,
    };
  },
};
