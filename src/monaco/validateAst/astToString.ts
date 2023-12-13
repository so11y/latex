import { Node } from "acorn";
import { CallExpressionSchema } from "./callExpression";
import { BinaryExpressionSchema } from "./binaryExpression";
import { generate, GENERATOR } from "astring";
import { LatexCallConfig } from "./latexConfig";
import { operators } from "../util"
import { ProgramSchema } from "./program";

export function toLatexString(node: Node) {
  const code = generate(node, {
    generator: Object.assign({}, GENERATOR, {
      [ProgramSchema.type](this: any, node: any, state) {
        const ordWrite = state.write;
        state.write = function(code: string) {
          if (code !== ";") {
            ordWrite.call(state, code)
          }
        }
        GENERATOR.Program.call(this, node, state);
      },
      [CallExpressionSchema.type]: function(this: any, node: any, state) {
        const config = (LatexCallConfig as any)[node.callee.name];
        const currentNode = {
          ...node,
          callee: {
            ...node.callee,
            name: config.alias
          }
        }
        if (config.name === LatexCallConfig.Conditional.name) {
          const [test, consequent, alternate] = node.arguments
          this[test.type](test, state)
          state.write(" ? ")
          this[consequent.type](consequent, state)
          state.write(" : ")
          this[alternate.type](alternate, state)
        } else {
          GENERATOR.CallExpression.call(this, currentNode, state)
        }
      },
      [BinaryExpressionSchema.type]: function(this: any, node: any, state) {
        const currnetNode = {
          ...node,
          operator: operators[node.operator as keyof typeof operators].latexOperator
        }
        GENERATOR.BinaryExpression.call(this, currnetNode, state);

      }
    }),
  });
  return code;
}
