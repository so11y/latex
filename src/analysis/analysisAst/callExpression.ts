import {
  AstType,
  ValidateSchemaBase,
  ValidateSchemaGuardMate,
  cratedNotThrough,
  cratedThrough,
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
): ValidateSchemaGuardMate<Identifier> {
  if (n.type !== AstType.Identifier) {
    return cratedNotThrough(n as any, ErrorMessage.Unknown.UnknownSyntax);
  }
  if (!names.includes(n.name)) {
    return cratedNotThrough(n, ErrorMessage.Unknown.UnKnownCall);
  }
  return cratedThrough(n);
}

function validateArguments(
  n: Array<Expression | SpreadElement>,
  parent: Node,
  latexConfig: LatexCallConfig
) {
  const { config } = latexConfig;
  if (n.length !== config.accept.length) {
    return cratedNotThrough(
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
      return cratedNotThrough(_config.node, test.message!);
    }
    return {
      ..._config,
      through: true,
    };
  }
  //过滤错误的节点
  function filterErrorNodes(config: ValidateSchemaGuardMate) {
    return config.through === false;
  }

  const errorNodes = n
    .map(nomadizeAccept)
    .map(nomadizeValidateResult)
    .filter(filterErrorNodes);
  if (errorNodes.length) {
    return cratedNotThrough(
      parent,
      null,
      errorNodes.map(({ node, message }) => {
        return cratedNotThrough(node, message!);
      })
    );
  }
  return cratedThrough(parent);
}

export const CallExpressionSchema: ValidateSchemaBase = {
  type: "CallExpression",
  validate(node: CallExpression) {
    const { callee, arguments: _arguments } = node;
    const safeCalleeName = validateCalleeName(callee);
    if (safeCalleeName.through) {
      const config =
        LatexCallConfig[
          safeCalleeName.node.name as keyof typeof LatexCallConfig
        ];
      return validateArguments(_arguments, node, config);
    }
    return safeCalleeName;
  },
};
