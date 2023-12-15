import { AstType } from "../types";
import { isLogicalOperators } from "../util/functional";

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
    alias: "And",
  },
  "||": {
    latexOperator: "\\|",
    name: AstType.LogicalExpression,
    alias: "Or",
  },
};

export const LogicalOperators =
  Object.keys(operators).filter(isLogicalOperators);
