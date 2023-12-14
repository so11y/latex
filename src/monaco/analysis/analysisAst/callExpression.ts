import {
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
import { curry } from "lodash-es";
import {
  LatexCallConfig,
  LatexNames,
  LatexValidateConfig,
} from "../helper/latexConfig";

export type CallExpressionSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "CallExpression";
};

export function validateCalleeName(
  n: Expression | Super,
  names = LatexNames
): ValidateSchemaGuardMate<Identifier> {
  const crateErrorMessage = curry(cratedNotThrough)(n);
  if (n.type !== "Identifier") {
    return crateErrorMessage("未知语法调用");
  }
  if (!names.includes(n.name)) {
    return crateErrorMessage("未知调用函数");
  }
  return cratedThrough(n);
}

function validateArguments(
  n: Array<Expression | SpreadElement>,
  parent: Node,
  latexConfig: LatexCallConfig
) {
  const { config } = latexConfig;
  const crateErrorMessage = curry(cratedNotThrough)(parent);
  if (n.length !== config.accept.length) {
    return crateErrorMessage(`参数个数不匹配需要${config.accept.length}个参数`);
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
      return {
        test: false,
        node: _config.node,
        message: test.message,
      };
    }
    return {
      ..._config,
      test: true,
    };
  }
  //过滤错误的节点
  function filterErrorNodes(config: ReturnType<typeof nomadizeValidateResult>) {
    return config.test === false;
  }

  const errorNodes = n
    .map(nomadizeAccept)
    .map(nomadizeValidateResult)
    .filter(filterErrorNodes);
  if (errorNodes.length) {
    return crateErrorMessage(
      null,
      errorNodes.map(({ node, message }) => {
        return cratedNotThrough(node, message!);
      })
    );
  }
  return cratedThrough(parent);
}

export const CallExpressionSchema: CallExpressionSchemeType = {
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
