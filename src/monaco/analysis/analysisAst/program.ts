import { NOOP } from "../util/functional"
import { ValidateSchemaBase } from "../types";

export type ProgramSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "Program";
};

export const ProgramSchema: ProgramSchemeType = {
  type: "Program",
  validate: NOOP,
};
