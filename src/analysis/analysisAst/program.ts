import { NOOP } from "../util/functional";
import { ValidateSchemaBase } from "../types";

export const ProgramSchema: ValidateSchemaBase = {
  type: "Program",
  validate: NOOP,
};
