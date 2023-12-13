import { CallExpressionSchema } from "./callExpression";
import { ExpressionStatementSchema } from "./expressionStatement";
import { IdentifierSchema } from "./identifier";
import { LiteralSchema } from "./literal";
import { ProgramSchema } from "./program";
import { BinaryExpressionSchema } from "./binaryExpression";
import { Node } from "acorn";
import { walk } from "estree-walker";
import { ValidateSchemaBase, ValidateSchemaGuardMate } from "./types";

function buildTypeNames(
  types: Array<Array<ValidateSchemaBase> | ValidateSchemaBase>
) {
  const mappings: Map<string, ValidateSchemaBase> = new Map();

  for (const value of types) {
    let current: ValidateSchemaBase = value as ValidateSchemaBase;
    mappings.set(current.type, current);
  }

  return {
    mappings,
    typeKeys: Array.from(mappings.keys()),
  };
}

const { typeKeys, mappings } = buildTypeNames([
  CallExpressionSchema,
  ExpressionStatementSchema,
  IdentifierSchema,
  LiteralSchema,
  ProgramSchema,
  BinaryExpressionSchema,
]);

export function validateWalk(
  ast: Node,
  diagnosisNodes: Array<ValidateSchemaGuardMate>
) {
  walk(ast as any, {
    enter(node, parent, prop, index) {
      if (!typeKeys.includes(node.type)) {
        diagnosisNodes.push({
          node: node as Node,
          through: false,
        });
        this.skip();
        return;
      }

      const schemas = mappings.get(node.type)!;
      const validate: ValidateSchemaGuardMate = schemas.validate(
        node,
        parent,
        prop,
        index
      );
      if (validate.through === false) {
        diagnosisNodes.push(validate);
        this.skip();
      }
    },
  });
}
