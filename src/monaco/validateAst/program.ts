import { ValidateSchemaBase } from "./types";
import { Program } from "acorn";

export type ProgramSchemeType = Omit<ValidateSchemaBase, "type"> & {
  type: "Program";
};

export const ProgramSchema: ProgramSchemeType = {
  type: "Program",
  validate(node: Program, parent) {
    return undefined;
  },
};
