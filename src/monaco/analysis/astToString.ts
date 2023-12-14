import { Node } from "estree";
import { generate, GENERATOR } from "astring";
import { LatexCallConfig } from "./helper/latexConfig";
import { AstType } from "./types";
import { operators } from "./helper/operators";

export function toLatexString(node: Node) {
  const code = generate(node, {
    generator: Object.assign({}, GENERATOR, {
      [AstType.Program](this: any, node: any, state: any) {
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
      [AstType.CallExpression](this: any, node: any, state: any) {
        const config = (LatexCallConfig as any)[node.callee.name];
        const currentNode = {
          ...node,
          callee: {
            ...node.callee,
            name: `\\text{${config.alias}}`,
          },
        };
        GENERATOR.CallExpression.call(this, currentNode, state);
      },
      [AstType.BinaryExpression](this: any, node: any, state: any) {
        const currentNode = {
          ...node,
          operator:
            operators[node.operator as keyof typeof operators].latexOperator,
        };
        GENERATOR.BinaryExpression.call(this, currentNode, state);
      },
      [AstType.LogicalExpression](this: any, node: any, state: any) {
        const currentNode = {
          ...node,
          operator:
            operators[node.operator as keyof typeof operators].latexOperator,
        };
        GENERATOR.LogicalExpression.call(this, currentNode, state);
      },
      [AstType.NumberLiteral](this: any, node: any, state: any) {
        GENERATOR.Literal.call(this, node, state);
      },
    }),
  });
  return code;
}
