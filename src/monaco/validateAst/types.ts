import { Node } from "acorn";
import { SyncHandler } from "estree-walker";

export interface ValidateSchemaGuardMate<T = Node> {
  node: T;
  through: boolean;
  message?: string | null | undefined;
  errorNodes?: Array<ValidateSchemaGuardMate>;
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
  errorNodes = []
): ValidateSchemaGuardMate<T> {
  return {
    node,
    through: false,
    message,
    errorNodes,
  };
}
export function cratedThrough<T = Node>(node: T) {
  return {
    node,
    through: true,
  };
}

