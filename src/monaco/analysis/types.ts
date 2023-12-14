import { Node } from "estree";
import { SyncHandler } from "estree-walker";
import { isObject, isString } from "lodash-es";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

export interface ValidateSchemaGuardMate<T = Node> {
  node: T;
  through: boolean;
  message?: string | null | undefined;
  errorNodes?: Array<ValidateSchemaGuardMate>;
  severity?: monaco.MarkerSeverity;
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
    ) => ValidateSchemaGuardMate | undefined
  : unknown;

export interface ValidateSchemaBase {
  type: string;
  validate: ValidateHandle;
}

export function cratedNotThrough<T = Node>(
  node: T,
  message: string | null,
  errorNodes?: Array<ValidateSchemaGuardMate>
): ValidateSchemaGuardMate<T>;
export function cratedNotThrough<T = Node>(
  node: T,
  message: {
    message: string;
    severity: monaco.MarkerSeverity;
  },
  errorNodes?: Array<ValidateSchemaGuardMate>
): ValidateSchemaGuardMate<T>;
export function cratedNotThrough<T = Node>(
  node: T,
  message: any,
  errorNodes: Array<ValidateSchemaGuardMate> = []
): ValidateSchemaGuardMate<T> {
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
export function cratedThrough<T = Node>(node: T) {
  return {
    node,
    through: true,
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
