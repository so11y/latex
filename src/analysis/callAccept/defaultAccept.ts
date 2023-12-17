import { LatexValidateAccept } from "../helper/latexConfig";
import {} from "../analysisAst/callExpression";
import { AstType, cratedFalseThrough } from "../types";

export const StringAccept: LatexValidateAccept = {
  key: "string",
  describe: "字符串",
  validate(node) {
    const notSameType = node.type !== AstType.Literal;
    if (notSameType) {
      return cratedFalseThrough(node, `参数需要是字符串`);
    }
    return true;
  },
};

export const NumberAccept: LatexValidateAccept = {
  key: "number",
  describe: "数值",
  validate(node) {
    const notSameType = node.type !== AstType.NumberLiteral;
    if (notSameType) {
      return cratedFalseThrough(node, `参数需要是数值`);
    }
    return true;
  },
};

/**
 * 当在进行递归下降时，每个 LaTeX 实例的语法都对应着所处层级的语法。
 * 因此，在到达 Array 层级时，并非是根层级的语法。
 * 这时需要明确标注 Array 层级所需的语法。
 * 比如，在处理 Call 时，首先需要解析参数是否为 Arr 类型。
 * 接着，会创建一个新的 LaTeX 实例，并将其语法设置为 Arr 的语法。
 * 然后，Array 层级将使用下一层指定的语法。AstType.NumberLiteral
 *
 * 不过数组里如果是方法的话就麻烦了，因为需要把两个Latex实例融合在一起
 * 应为方法参数支持三元表达式,加减法等等语法
 */

export const ArrayAcceptNumber: LatexValidateAccept = {
  key: "array",
  describe: "数组<number>",
  fork: [AstType.ArrayExpression],
  child: {
    accept: [
      {
        fork: [AstType.NumberLiteral],
        ...NumberAccept,
      },
    ],
  },
  validate(node) {
    const notSameType = node.type !== AstType.ArrayExpression;
    if (notSameType) {
      return cratedFalseThrough(node, `参数需要是数组`);
    }
    return true;
  },
};

export const AllLatexCallAccept = [
  StringAccept,
  NumberAccept,
  ArrayAcceptNumber,
];
