import {
  AstType,
  ValidateDefineBase,
  cratedFalseThrough,
  cratedTrueThrough,
} from "../types";
import { ExpressionStatement } from "estree";
import { ErrorMessage } from "../helper/errorMessage";
import { isLogicalOperators, isSafeOperators } from "../helper/defineOperators";

export const ExpressionStatementDefine: ValidateDefineBase = {
  type: "ExpressionStatement",
  validate(node: ExpressionStatement, parent) {
    const isProgram = parent.type === AstType.Program;
    const { expression } = node;

    if (isProgram === false) {
      return cratedFalseThrough(node, ErrorMessage.Unknown.UnknownSyntax);
    }

    if (expression.type === AstType.BinaryExpression) {
      if (isLogicalOperators(expression.operator)) {
        return cratedFalseThrough(node, ErrorMessage.Expression.RootNotBool);
      }
      const { through, message } = isSafeOperators(expression.operator);
      if (through === false) {
        return cratedFalseThrough(node, message!);
      }
    }

    const isNotCanRootType =
      [
        AstType.BinaryExpression,
        AstType.ConditionalExpression,
        AstType.CallExpression,
        AstType.NumberLiteral,
      ].some((type) => expression.type === type) === false;
    if (isNotCanRootType) {
      return cratedFalseThrough(node, ErrorMessage.Expression.NotCanRootAst);
    }

    return cratedTrueThrough(node, ["expression"]);
  },
};
