import { StoreContainProvide } from "../components/storeContain";
import { ContainLatexComponentStore } from "../components/types";
import { BinaryExpression } from "./binaryExpression";
import { LogicalExpression } from "./logicalExpression";
import { CallExpression } from "./callExpression";
import { Literal, NumberLiteral } from "./literal";
import { ConditionalExpression } from "./conditionalExpression";
import { Ast } from "./ast";
import { encodeBracket } from "./helper";

function isPackComponen(v: ContainLatexComponentStore,
  s: StoreContainProvide
) {
  const names = ["Bracket", "Number"]
  while (names.includes(v.latexName)) {
    const nestChild = encodeBracket(v, s);
    v = nestChild;
  }
  return v
}


export function decode(v: Record<string, any>, s: StoreContainProvide) {
  const { type } = v;
  const struct = astTypeMapping.get(type)!;
  const b = new struct();
  return b.decode(v, s);
}

export function newId(
  v: Record<string, any>,
  s: StoreContainProvide,
  parentId: string
) {
  const { type } = v;
  const struct = astTypeMapping.get(type)!;
  const b = new struct();
  b.newId(v, s, parentId);
}

export function encode(
  v: ContainLatexComponentStore,
  s: StoreContainProvide
): Record<string, any> {

  v = isPackComponen(v, s);
  const struct =
    buildTreeMapping.get(v.latexName)! || buildTreeMapping.get(v.componentName!);
  const b = new struct();
  return b.encode(v, s);
}

export const buildTreeMapping = new Map<string, new () => Ast>([
  ["Binary", BinaryExpression],
  ["Logical", LogicalExpression],
  ["LatexContain", CallExpression],
  ["SingleContain", CallExpression],
  ["Bracket", CallExpression], //括号
  ["Filed", Literal],
  ["NumberFiled", NumberLiteral],
  ["Conditional", ConditionalExpression],
]);

export const astTypeMapping = new Map<string, new () => Ast>([
  ["ConditionalExpression", ConditionalExpression],
  ["LogicalExpression", LogicalExpression],
  ["BinaryExpression", BinaryExpression],
  ["CallExpression", CallExpression],
  ["NumberLiteral", NumberLiteral],
  ["Literal", Literal],
]);
