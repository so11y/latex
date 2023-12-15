import { Literal } from "estree";
import { LatexValidateCallAccept } from "../helper/latexConfig";
import { AstType, cratedFalseThrough } from "../types";

export const DefaultAccept: Array<LatexValidateCallAccept> = [
  {
    validate(node: any) {
      const notSameType = node.type !== AstType.Literal;
      if (notSameType) {
        return cratedFalseThrough(node, `参数需要是字符串`);
      }
      const isSomeType = typeof (node as Literal).value !== "string";
      if (isSomeType) {
        return cratedFalseThrough(node, `参数需要是字符串`);
      }
      return true;
    },
  },
];
