import { describe, expect, test } from "vitest";
import { Latex } from "../src/analysis/validate";
import LiteralText from "./text/literal.json";
import { pick } from "lodash-es";
import binaryExpressionText from "./text/binaryExpression.json";
import logicalExpressionText from "./text/logicalExpression.json";
import conditionalExpression from "./text/conditionalExpression.json";

function builderTest(name: string, json: Array<Record<string, any>>) {
  describe(name, () => {
    json.forEach((item, index) => {
      test(`${item.title}__(${index})`, () => {
        const { markers } = Latex.getInstance().getMarkers(item.value);
        expect(markers.length === 0).toEqual(item.expect);
        expect(
          markers.map((marker) => pick(marker, ["message"]))
        ).toMatchSnapshot();
      });
    });
  });
}
builderTest("literal", LiteralText);
builderTest("binaryExpression", binaryExpressionText);
builderTest("logicalExpression", logicalExpressionText);
builderTest("conditionalExpression", conditionalExpression);
