import { walk } from "estree-walker";
import { Program } from "estree";

export function walkLocalAstToServer(root: Program) {
    console.log();
  walk(root, {
    enter() {},
    leave() {},
  });
}
