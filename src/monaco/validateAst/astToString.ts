import { Node } from "acorn";
import { CallExpressionSchema } from "./callExpression";
import { BinaryExpressionSchema } from "./binaryExpression";
import { generate, GENERATOR } from "astring";
import { LatexCallConfig, macroLatexCallConfig } from "./latexConfig";
import { operators } from "../util";
import { ProgramSchema } from "./program";

export function toLatexString(node: Node) {
  const code = generate(node, {
    generator: Object.assign({}, GENERATOR, {
      [ProgramSchema.type](this: any, node: any, state: any) {
        const ordWrite = state.write;
        state.write = function (code: string) {
          if (code !== ";") {
            ordWrite.call(state, code);
          }
        };
        GENERATOR.Program.call(this, node, state);
      },
      [CallExpressionSchema.type]: function (this: any, node: any, state: any) {
        const config = (LatexCallConfig as any)[node.callee.name];
        const currentNode = {
          ...node,
          callee: {
            ...node.callee,
            name: config.alias,
          },
        };
        GENERATOR.CallExpression.call(this, currentNode, state);
      },
      [BinaryExpressionSchema.type]: function (
        this: any,
        node: any,
        state: any
      ) {
        const currentNode = {
          ...node,
          operator:
            operators[node.operator as keyof typeof operators].latexOperator,
        };
        GENERATOR.BinaryExpression.call(this, currentNode, state);
      },
    }),
  });
  return code;
}
