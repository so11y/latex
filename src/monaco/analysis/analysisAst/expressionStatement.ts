import { AstType, ValidateSchemaBase, cratedNotThrough } from "../types";
import { ExpressionStatement } from "estree";
import * as monaco from "monaco-editor"
import { isLogicalOperators } from "../helper/operators";
import { ErrorMessage } from "../helper/errorMessage";

export type ExpressionStatementSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "ExpressionStatement";
};

export const ExpressionStatementSchema: ExpressionStatementSchemeType = {
  type: "ExpressionStatement",
  validate(node: ExpressionStatement, parent) {
    const isProgram = parent.type === AstType.Program;
    const { expression } = node;
    if (isProgram === false) {
      return cratedNotThrough(node, ErrorMessage.Unknown.UnknownSyntax);
    }

    const isLogicalExpression = expression.type === AstType.LogicalExpression;
    const isRealOperatorLogical =
      expression.type === AstType.BinaryExpression &&
      isLogicalOperators(expression.operator);

    if (isLogicalExpression || isRealOperatorLogical) {
      return cratedNotThrough(node, {
        message: ErrorMessage.Expression.RootNotBool,
        severity: monaco.MarkerSeverity.Warning,
      });
    }
  },
};
