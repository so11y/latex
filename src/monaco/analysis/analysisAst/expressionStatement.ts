import { AstType, ValidateSchemaBase, cratedNotThrough } from "../types";
import { ExpressionStatement } from "estree";
import * as monaco from "monaco-editor";
import { isLogicalOperators } from "../helper/operators";

export type ExpressionStatementSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "ExpressionStatement";
};

export const ExpressionStatementSchema: ExpressionStatementSchemeType = {
  type: "ExpressionStatement",
  validate(node: ExpressionStatement, parent) {
    const isProgram = parent.type === AstType.Program;
    const { expression } = node;
    if (isProgram === false) {
      return cratedNotThrough(node, "未知语法");
    }

    const isLogicalExpression = expression.type === AstType.LogicalExpression;
    const isRealOperatorLogical =
      expression.type === AstType.BinaryExpression &&
      isLogicalOperators(expression.operator);

    if (isLogicalExpression || isRealOperatorLogical) {
      return cratedNotThrough(node, {
        message: "当前最终运算得出的可能是一个布尔值，请检查",
        severity: monaco.MarkerSeverity.Warning,
      });
    }
  },
};
