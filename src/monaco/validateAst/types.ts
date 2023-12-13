import { Node } from "acorn";
import { SyncHandler } from "estree-walker";

export interface ValidateSchemaGuardMate {
  node: Node;
  through: boolean;
  message?: string | null | undefined;
}

type ValidateHandle = SyncHandler extends (
  this: any,
  node: any,
  parent: any,
  ...args: infer Args
) => any
  ? (node: any, parent?: any, ...args: [...Args]) => ValidateSchemaGuardMate
  : unknown;

export interface ValidateSchemaBase {
  type: string;
  validate: ValidateHandle;
}
