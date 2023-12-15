import { Node } from "estree";
import { SyncHandler } from "estree-walker";
import { isObject, isString } from "lodash-es";
import * as monaco from "monaco-editor";

interface ValidateGuarMate {
  through: boolean;
}

export interface ValidateGuardFalseMate<T extends Node = Node>
  extends ValidateGuarMate {
  node: T;
  through: false;
  message?: string | null | undefined;
  errorNodes?: Array<ValidateGuardFalseMate>;
  severity?: monaco.MarkerSeverity;
}

export interface ValidateGuardTrueMate<T extends Node = Node>
  extends ValidateGuarMate {
  through: true;
  node: T;
  eatKeys?: Array<string>;
}

type ValidateHandle = SyncHandler extends (
  this: any,
  node: any,
  parent: any,
  ...args: infer Args
) => any
  ? (
      node: any,
      parent?: any,
      ...args: [...Args]
    ) => ValidateGuardFalseMate | ValidateGuardTrueMate
  : unknown;

export interface ValidateDefineBase {
  type: string;
  validate: ValidateHandle;
}

export function cratedFalseThrough<T extends Node = Node>(
  node: T,
  message: string | null,
  errorNodes?: Array<ValidateGuardFalseMate>
): ValidateGuardFalseMate<T>;
export function cratedFalseThrough<T extends Node = Node>(
  node: T,
  message: {
    message: string;
    severity: monaco.MarkerSeverity;
  },
  errorNodes?: Array<ValidateGuardFalseMate>
): ValidateGuardFalseMate<T>;
export function cratedFalseThrough<T extends Node = Node>(
  node: T,
  message: any,
  errorNodes: Array<ValidateGuardFalseMate> = []
): ValidateGuardFalseMate<T> {
  const handleMessage = function () {
    const _message = {
      message: "",
      severity: monaco.MarkerSeverity.Error,
    };
    if (isString(message)) {
      _message.message = message;
    } else if (isObject(message)) {
      Object.assign(_message, message);
    }
    return _message;
  };

  return {
    node,
    through: false,
    errorNodes,
    ...handleMessage(),
  };
}

export function cratedTrueThrough<T extends Node = Node>(
  node: T,
  eatKeys: Array<string> = []
): ValidateGuardTrueMate {
  return {
    node,
    through: true,
    eatKeys,
  };
}

export enum AstType {
  BinaryExpression = "BinaryExpression",
  LogicalExpression = "LogicalExpression",
  CallExpression = "CallExpression",
  Literal = "Literal",
  Identifier = "Identifier",
  ConditionalExpression = "ConditionalExpression",
  Program = "Program",
  NumberLiteral = "NumberLiteral", //不是acorn的标准，为服务端需要。
}

export function ValidateGuardMateWhere(v: {
  falseMateGuard:
    | ValidateGuardFalseMate
    | Array<ValidateGuardFalseMate | undefined>
    | undefined
    | false;
  trueMateGuard: ValidateGuardTrueMate;
}): ValidateGuardFalseMate | ValidateGuardTrueMate {
  if (!v.falseMateGuard) {
    return v.trueMateGuard;
  }
  if (Array.isArray(v.falseMateGuard) && v.falseMateGuard.some(Boolean)) {
    return v.falseMateGuard.find(Boolean)!;
  }
  if (!Array.isArray(v.falseMateGuard) && v.falseMateGuard.through === false) {
    return v.falseMateGuard;
  }
  return v.trueMateGuard;
}
