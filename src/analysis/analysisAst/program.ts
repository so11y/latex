import {
  ValidateGuardMateWhere,
  ValidateSchemaBase,
  cratedTrueThrough,
} from "../types";

export const ProgramSchema: ValidateSchemaBase = {
  type: "Program",
  validate(node) {
    return ValidateGuardMateWhere({
      falseMateGuard: undefined,
      trueMateGuard: cratedTrueThrough(node, ["body"]),
    });
  },
};
