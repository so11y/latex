import { Literal } from "estree";
import { LatexValidateCallAccept } from "../helper/latexConfig";
import { AstType, cratedFalseThrough } from "../types";

export const StringAccept: LatexValidateCallAccept = {
  key: "string",
  describe: "字符串",
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
};
export const NumberAccept: LatexValidateCallAccept = {
  key: "number",
  describe: "数值",
  validate(node: any) {
    const notSameType = node.type !== AstType.NumberLiteral;
    if (notSameType) {
      return cratedFalseThrough(node, `参数需要是数值`);
    }
    return true;
  },
};

export const AllLatexCallAccept = [StringAccept, NumberAccept];
