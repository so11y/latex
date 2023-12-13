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
    name:  "BinaryExpression"
  },
  "-": {
    latexOperator: "-",
    name: "BinaryExpression"
  },
  "*": {
    latexOperator: "*",
    name: "BinaryExpression"
  },
  "/": {
    latexOperator: '{\\div}',
    name: "BinaryExpression"
  },
  "==": {
    latexOperator: "\\equiv",
   name: "LogicalExpression"
  },
  "!=": {
    latexOperator: "\\ne",
    name: "LogicalExpression"
  },
  ">": {
    latexOperator: ">",
    name: "LogicalExpression"
  },
  "<": {
    latexOperator: "<",
    name: "LogicalExpression"
  },
  ">=": {
    latexOperator: "\\ge",
    name: "LogicalExpression"
  }
}
