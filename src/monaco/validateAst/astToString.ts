import { Node } from "acorn";
import { CallExpressionSchema } from "./callExpression";
import { ExpressionStatementSchema } from "./expressionStatement";
import { IdentifierSchema } from "./identifier";
import { LiteralSchema } from "./literal";
import { ProgramSchema } from "./program";
import { BinaryExpressionSchema } from "./binaryExpression";
import { generate, GENERATOR, Generator } from "astring";
import { LatexCallConfig } from "./latexConfig";
import { walk } from "estree-walker";

export function toLatexString(node: Node) {
  const code = generate(node, {
    generator: Object.assign({}, GENERATOR, {
      CallExpressionSchema: function (this: any, node: any, state: any) {
        const config = (LatexCallConfig as any)[node.callee.name];
        state.write(config.alias);
        state.write("(");
        node.arguments.forEach((v: Node) => {
          this[v.type](v, state);
        });
        state.write(")");
      },
    }),
  });
  return code;
}
