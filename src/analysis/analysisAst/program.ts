import {
  ValidateGuardMateWhere,
  ValidateDefineBase,
  cratedTrueThrough,
} from "../types";

export const ProgramDefine: ValidateDefineBase = {
  type: "Program",
  validate(node) {
    return ValidateGuardMateWhere({
      falseMateGuard: undefined,
      trueMateGuard: cratedTrueThrough(node, ["body"]),
    });
  },
};
