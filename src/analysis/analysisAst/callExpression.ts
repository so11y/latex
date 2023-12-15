import {
  AstType,
  ValidateSchemaBase,
  ValidateGuardFalseMate,
  cratedFalseThrough,
  cratedTrueThrough,
  ValidateGuardMateWhere,
  ValidateGuardTrueMate,
} from "../types";
import {
  CallExpression,
  Expression,
  Identifier,
  SpreadElement,
  Super,
  Node,
} from "estree";
import { LatexCallConfig, LatexNames } from "../helper/latexConfig";
import { ErrorMessage, formatterError } from "../helper/errorMessage";

export function validateCalleeName(
  n: Expression | Super,
  names = LatexNames
): ValidateGuardFalseMate<Identifier> | ValidateGuardTrueMate<Identifier> {
  if (n.type !== AstType.Identifier) {
    return cratedFalseThrough(n as any, ErrorMessage.Unknown.UnknownSyntax);
  }
  if (!names.includes(n.name)) {
    return cratedFalseThrough(n, ErrorMessage.Unknown.UnKnownCall);
  }
  return cratedTrueThrough(n) as ValidateGuardTrueMate<Identifier>;
}

function validateArguments(
  n: Array<Expression | SpreadElement>,
  parent: Node,
  latexConfig: LatexCallConfig
) {
  const { config } = latexConfig;
  if (n.length !== config.accept.length) {
    return cratedFalseThrough(
      parent,
      formatterError`${ErrorMessage.CallExpression.ArgLengthExpect} ${config.accept.length}`
    );
  }
  //标准化accept参数
  function nomadizeAccept(node: Expression | SpreadElement, index: number) {
    const accept = config.accept[index];
    return {
      node,
      accept,
    };
  }
  //验证accept参数，如果不通过返回错误信息
  function nomadizeValidateResult(
    _config: ReturnType<typeof nomadizeAccept>,
    index: number
  ) {
    const test = _config.accept.validate.call(config, _config.node, n, index);
    if (test !== true) {
      return cratedFalseThrough(_config.node, test.message!);
    }
    return {
      ..._config,
      through: true,
    };
  }
  //过滤错误的节点
  function filterErrorNodes(config: ReturnType<typeof nomadizeValidateResult>) {
    return config.through === false;
  }

  const errorNodes = n
    .map(nomadizeAccept)
    .map(nomadizeValidateResult)
    .filter(filterErrorNodes) as Array<ValidateGuardFalseMate>;
  if (errorNodes.length) {
    return cratedFalseThrough(
      parent,
      null,
      errorNodes.map(({ node, message }) => {
        return cratedFalseThrough(node, message!);
      })
    );
  }
}

export const CallExpressionSchema: ValidateSchemaBase = {
  type: "CallExpression",
  validate(node: CallExpression) {
    const { callee, arguments: _arguments } = node;
    const safeCalleeName = validateCalleeName(callee);

    if (safeCalleeName.through === false) {
      return safeCalleeName;
    }

    const config =
      LatexCallConfig[safeCalleeName.node.name as keyof typeof LatexCallConfig];

    return ValidateGuardMateWhere({
      falseMateGuard: validateArguments(_arguments, node, config),
      trueMateGuard: cratedTrueThrough(node, ["callee", "arguments"]),
    });
  },
};
