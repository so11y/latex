import { walk, SyncHandler } from "estree-walker";
import { Program, BinaryExpression, LogicalExpression } from "estree";
import { AstType } from "./types";
import { isLogicalOperators, operators } from "./helper/defineOperators";
import { BinaryOperator } from "acorn";

type WalkHandleThis = ThisParameterType<SyncHandler>;

const normalizeServerAst = {
  [AstType.Program](this: WalkHandleThis, node: Program) {
    // console.log("---", node);
  },
  [AstType.BinaryExpression](
    this: WalkHandleThis,
    node: BinaryExpression | LogicalExpression
  ) {
    const ordOperator = node.operator as keyof typeof operators;
    if (operators[ordOperator]) {
      node.operator = operators[ordOperator].alias as BinaryOperator;
      if (isLogicalOperators(ordOperator)) {
        this.replace({
          ...node,
          type: AstType.LogicalExpression,
        } as any);
      }
    } else {
      throw "未知操作符号节点";
    }
  },
};

export function walkLocalAstToServerAst(root: Program) {
  walk(root, {
    enter(node) {
      switch (node.type) {
        case AstType.BinaryExpression:
        case AstType.LogicalExpression:
          normalizeServerAst[AstType.BinaryExpression].call(this, node);
          break;
      }
    },
    leave(node) {
      switch (node.type) {
        case AstType.Program:
          normalizeServerAst[node.type].call(this, node);
          break;
      }
    },
  });
}
