import { ValidateSchemaBase } from "./types";
import { Identifier } from "acorn";
import { LatexNames } from "./callExpression";

export type IdentifierSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "Identifier";
};

export const IdentifierSchema: IdentifierSchemeType = {
  type: "Identifier",
  validate(node: Identifier, parent) {
    const maybeKnow = LatexNames.includes(node.name);
    const parentIsCallExpression = !!parent && parent.type === "CallExpression";
    function handleMessage() {
      if (maybeKnow && parentIsCallExpression) {
        return null;
      }
      if (maybeKnow === false) {
        return "未知字符";
      }
      if (parentIsCallExpression === false) {
        return `需要调用函数方式书写${node.name}(word)`;
      }
      return "未知字符";
    }
    return {
      message: handleMessage(),
      through: maybeKnow && parentIsCallExpression,
      node,
    };
  },
};
