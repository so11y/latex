import {
  AstType,
  ValidateDefineBase,
  ValidateGuardFalseMate,
  cratedFalseThrough,
  cratedTrueThrough,
  ValidateGuardTrueMate,
} from "../types";
import { CallExpression, Node, Identifier } from "estree";
import { ErrorMessage } from "../helper/errorMessage";
import { validateArguments } from "../helper/validateArguments";

export function validateCalleeName(
  n: Node,
  names: string[]
): ValidateGuardFalseMate<Identifier> | ValidateGuardTrueMate<Identifier> {
  if (n.type !== AstType.Identifier) {
    return cratedFalseThrough(n as any, ErrorMessage.Unknown.UnknownSyntax);
  }
  if (!names.includes(n.name)) {
    return cratedFalseThrough(n, ErrorMessage.Unknown.UnKnownCall);
  }
  return cratedTrueThrough(n) as ValidateGuardTrueMate<Identifier>;
}

export const CallExpressionDefine: ValidateDefineBase = {
  type: "CallExpression",
  validate(node: CallExpression) {
    const { callee, arguments: _arguments } = node;
    const names = this.LatexConfig.LatexNames;
    const safeCalleeName = validateCalleeName(callee, names);

    if (safeCalleeName.through === false) {
      return safeCalleeName;
    }

    const { config } = (this.LatexConfig.LatexCallConfig as any)[
      safeCalleeName.node.name
    ];

    const result = validateArguments.call(
      this,
      _arguments,
      node,
      config.accept,
      config.accept.length
    );

    if (result === true) {
      return cratedTrueThrough(node, ["callee", "arguments"], true);
    }

    return result;
  },
};
