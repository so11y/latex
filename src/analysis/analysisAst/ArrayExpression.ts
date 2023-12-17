import { ValidateDefineBase, cratedTrueThrough } from "../types";
import { ArrayExpression, Node } from "estree";
import { validateArguments } from "../helper/validateArguments";
import { ForkLatex } from "../latex";

export const ArrayExpressionDefine: ValidateDefineBase = {
  type: "ArrayExpression",
  validate(node: ArrayExpression, _) {
    const elements = node.elements as Node[];

    const result = validateArguments.call(
      this,
      elements,
      node,
      (this as ForkLatex).currentAcceptConfig!.accept,
      Infinity
    );

    if (result === true) {
      return cratedTrueThrough(node, ["elements"], true);
    }

    return result;
  },
};
