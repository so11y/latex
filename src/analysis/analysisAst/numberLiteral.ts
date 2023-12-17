import { ValidateDefineBase, cratedTrueThrough } from "../types";
import { Node, NumberLiteral } from "estree";

export const NumberLiteralDefine: ValidateDefineBase = {
  type: "NumberLiteral",
  validate(node: NumberLiteral, parent: Node) {
    //感觉数值不需要约束，因为已经在父级中已经约束了
    return cratedTrueThrough(node);
  },
};
