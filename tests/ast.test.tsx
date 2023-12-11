import ConditionalExpressionAst from "./features/ConditionalExpression.json";
import BinaryExpression from "./features/BinaryExpression.json";
import NestBracket from "./features/NestBracket.json";
import { assert, describe, expect, test } from "vitest";
import { createSimpleApp } from "./helper/createApp";
import { StoreContainProvide } from "../src/components/storeContain";
import { nextTick } from "vue";

async function astTest(json: Record<string, any>) {
  let store: StoreContainProvide;
  const app = createSimpleApp((s) => {
    store = s;
    return null;
  });
  //@ts-ignore
  if (!store) return;
  store.setActiveId("-1");
  await store.decode(json);
  await nextTick();
  expect(store.encode()).toEqual(json);
  expect(app.html()).toMatchSnapshot();
}

describe("ast ", () => {
  test.each([
    {
      ast: ConditionalExpressionAst,
      name: "ConditionalExpressionAst",
    },
    {
      ast: BinaryExpression,
      name: "BinaryExpression",
    },
    {
      ast: NestBracket,
      name: "NestBracket",
    },
  ])("ast($name)", async (a, b) => {
    await astTest(a.ast);
  });
});
