import {
  AstType,
  ValidateSchemaBase,
  // cratedFalseThrough,
  cratedTrueThrough,
} from "../types";
import { Node, NumberLiteral } from "estree";
// import { BinaryExpressionSchema } from "./binaryExpression";
// import { ErrorMessage } from "../helper/errorMessage";

export const NumberLiteralSchema: ValidateSchemaBase = {
  type: "NumberLiteral",
  validate(node: NumberLiteral, parent: Node) {
    //感觉数值不需要约束，因为已经在父级中已经约束了
    //如果真的要约束数值在什么情况下才能使用，后面需要搭配上下文
    // if (parent.type === AstType.ConditionalExpression) {
    //   return cratedTrueThrough(node);
    // }
    // if (parent.type !== BinaryExpressionSchema.type) {
    //   return cratedFalseThrough(
    //     node,
    //     ErrorMessage.NumberLiteral.NeedComposeBinary
    //   );
    // }
    return cratedTrueThrough(node);
  },
};
