import { AstType } from "../types";
import { ErrorMessage } from "./errorMessage";

export const operators = {
  "+": {
    latexOperator: "+",
    name: AstType.BinaryExpression,
    alias: "Plus",
  },
  "-": {
    latexOperator: "-",
    name: AstType.BinaryExpression,
    alias: "Minus",
  },
  "*": {
    latexOperator: "*",
    name: AstType.BinaryExpression,
    alias: "Times",
  },
  "/": {
    latexOperator: "{\\div}",
    name: AstType.BinaryExpression,
    alias: "Div",
  },
  "==": {
    latexOperator: "\\equiv",
    name: AstType.LogicalExpression,
    alias: "Eq",
  },
  "!=": {
    latexOperator: "\\ne",
    name: AstType.LogicalExpression,
    alias: "NEq",
  },
  ">": {
    latexOperator: ">",
    name: AstType.LogicalExpression,
    alias: "Gt",
  },
  "<": {
    latexOperator: "<",
    name: AstType.LogicalExpression,
    alias: "Lt",
  },
  ">=": {
    latexOperator: "\\ge",
    name: AstType.LogicalExpression,
    alias: "EGt",
  },
  "<=": {
    latexOperator: "\\ge",
    name: AstType.LogicalExpression,
    alias: "ELt",
  },
  "&&": {
    latexOperator: "\\&\\&",
    name: AstType.LogicalExpression,
    alias: "And"
  },
  "||": {
    latexOperator: "\\|",
    name: AstType.LogicalExpression,
    alias: "Or"
  },
};

export const LogicalOperators = Object.keys(operators).filter((node) => {
  return isLogicalOperators(node);
});

export function isSafeOperators(operator: string) {
  if (!operators[operator as keyof typeof operators]) {
    return {
      through: false,
      message: ErrorMessage.Unknown.UnknownOperator,
    };
  }
  return {
    through: true,
  };
}

export function isLogicalOperators(operator: string) {
  return (
    operators[operator as keyof typeof operators]?.name ===
    AstType.LogicalExpression
  );
}
