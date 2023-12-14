import { AstType } from "../validateAst/types";

export function extractTokenAndNumbers(str: string) {
  const regex = /\((\d+):(\d+)\)$/;
  const match = str.match(regex);
  if (match) {
    const extracted = {
      token: match[0],
      line: parseInt(match[1]),
      column: parseInt(match[2]),
    };
    return extracted;
  } else {
    return null;
  }
}

export const operators = {
  "+": {
    latexOperator: "+",
    name: AstType.BinaryExpression,
  },
  "-": {
    latexOperator: "-",
    name: AstType.BinaryExpression,
  },
  "*": {
    latexOperator: "*",
    name: AstType.BinaryExpression,
  },
  "/": {
    latexOperator: "{\\div}",
    name: AstType.BinaryExpression,
  },
  "==": {
    latexOperator: "\\equiv",
    name: AstType.LogicalExpression,
  },
  "!=": {
    latexOperator: "\\ne",
    name: AstType.LogicalExpression,
  },
  ">": {
    latexOperator: ">",
    name: AstType.LogicalExpression,
  },
  "<": {
    latexOperator: "<",
    name: AstType.LogicalExpression,
  },
  ">=": {
    latexOperator: "\\ge",
    name: AstType.LogicalExpression,
  },
};

export const LogicalOperators = Object.keys(operators).filter((node) => {
  return isLogicalOperators(node);
});

export function isSafeOperators(operator: string) {
  if (!operators[operator as keyof typeof operators]) {
    return {
      through: false,
      message: "不支持位运算等符号",
    };
  }
  return {
    through: true,
  };
}

export function isLogicalOperators(operator: string) {
  return (
    operators[operator as keyof typeof operators].name ===
    AstType.LogicalExpression
  );
}
