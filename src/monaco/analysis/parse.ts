import { Parser } from "acorn";
import { AstType } from "./types";
import { isNumber } from "lodash-es";
import { macroLatexCallConfig } from "./helper/latexConfig";
const convertAst = {
  [AstType.Literal](value: string | number) {
    if (isNumber(value)) {
      return AstType.NumberLiteral;
    }
    return AstType.Literal;
  },
};
//@ts-ignore
export const parse = Parser.extend((_Parser: any) => {
  return class extends _Parser {
    finishNode(node: any, type: any) {
      if (type === AstType.Literal) {
        return super.finishNode(node, convertAst[AstType.Literal](node.value));
      }
      return super.finishNode(node, type);
    }
    parseSubscript(...arg: any) {
      const node = super.parseSubscript(...arg);
      if (
        node.type === AstType.CallExpression &&
        node.callee?.name === macroLatexCallConfig.Conditional.name
      ) {
        const [test, consequent, alternate] = node.arguments;
        const { loc, start, end } = node;
        return {
          type: AstType.ConditionalExpression,
          loc,
          start,
          end,
          test,
          consequent,
          alternate,
        };
      }
      return node;
    }
    // buildBinary(...arg: any) {
    //   const node = super.buildBinary(...arg);
    //   if (
    //     node.type === AstType.BinaryExpression &&
    //     isLogicalOperators(node.operator)
    //   ) {
    //     return {
    //       ...node,
    //       type: AstType.LogicalExpression,
    //     };
    //   }
    //   return node;
    // }
  };
});
