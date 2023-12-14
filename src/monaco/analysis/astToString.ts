import { Node } from "estree";
import { CallExpressionSchema } from "./analysisAst/callExpression";
import { BinaryExpressionSchema } from "./analysisAst/binaryExpression";
import { generate, GENERATOR } from "astring";
import { LatexCallConfig } from "./latexConfig";
import { operators } from "../util";
import { ProgramSchema } from "./analysisAst/program";

export function toLatexString(node: Node) {
  const code = generate(node, {
    generator: Object.assign({}, GENERATOR, {
      [ProgramSchema.type](this: any, node: any, state: any) {
        const ordWrite = state.write;
        state.write = function (code: string) {
          switch (code) {
            case "(":
              ordWrite.call(state, "\\left (");
              return;
            case ")":
              ordWrite.call(state, "\\right )");
              return;
          }

          if (code !== ";") {
            ordWrite.call(state, code);
          }
        };
        GENERATOR.Program.call(this, node, state);
      },
      [CallExpressionSchema.type](this: any, node: any, state: any) {
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
      [BinaryExpressionSchema.type](this: any, node: any, state: any) {
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
