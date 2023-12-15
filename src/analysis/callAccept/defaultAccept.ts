import { Literal } from "estree";
import { LatexValidateCallAccept } from "../helper/latexConfig";
import { AstType, cratedNotThrough } from "../types";

export const DefaultAccept: Array<LatexValidateCallAccept> = [
  {
    validate(node: any) {
      const notSameType = node.type !== AstType.Literal;
      if (notSameType) {
        return cratedNotThrough(node, `参数需要是字符串`);
      }
      const isSomeType = typeof (node as Literal).value !== "string";
      if (isSomeType) {
        return cratedNotThrough(node, `参数需要是字符串`);
      }
      return true;
    },
  },
];
