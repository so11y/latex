import { Node } from "estree";
import { LatexValidateAccept } from "./latexConfig";
import { ValidateGuardFalseMate, cratedFalseThrough } from "../types";
import { ErrorMessage, formatterError } from "./errorMessage";
import { LatexSyntax } from "../analysisAst";
import { ForkLatex, Latex } from "../latex";
import { buildTypeNames } from "../util/functional";

export function validateArguments(
  this: Latex,
  n: Array<Node>,
  parent: Node,
  accept: Array<LatexValidateAccept>,
  len: number
) {
  let _this = this;
  if (n.length !== len && len !== Infinity) {
    return cratedFalseThrough(
      parent,
      formatterError`${ErrorMessage.CallExpression.ArgLengthExpect} ${len}`
    );
  }
  //标准化accept参数
  function nomadizeAccept(node: Node, index: number) {
    return {
      node,
      accept: len === Infinity ? accept[0] : accept[index],
    };
  }
  //验证accept参数，如果不通过返回错误信息
  function nomadizeValidateResult(
    _config: ReturnType<typeof nomadizeAccept>,
    index: number
  ) {
    const test = _config.accept.validate.call(
      _this,
      _config.node,
      parent,
      index
    );
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

  const nomadizeAccepts = n.map(nomadizeAccept);

  const errorNodes = nomadizeAccepts
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

  let childAccept = nomadizeAccepts
    .filter((config) => config.accept.fork)
    .map(({ accept, node }) => {
      const latexSyntax = LatexSyntax();
      const syntaxDefine = accept.fork!.map((key) => {
        return (latexSyntax as any)[`${key}Define`];
      });
      const fork = new ForkLatex(buildTypeNames(syntaxDefine));
      fork.currentAcceptConfig = accept.child!;
      return fork.validate(null, node as any);
    })
    .map(({ diagnosisNodes }) => diagnosisNodes)
    .flat(Infinity) as Array<ValidateGuardFalseMate>;

  if (childAccept.length) {
    return cratedFalseThrough(parent, null, childAccept);
  }

  return true;
}
