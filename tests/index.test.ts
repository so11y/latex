import { describe, expect, test } from "vitest";
import { Latex } from "../src/analysis/validate";
import LiteralText from "./text/literal.json";
import { pick } from "lodash-es";
import binaryExpressionText from "./text/binaryExpression.json";
import logicalExpressionText from "./text/logicalExpression.json";
import conditionalExpression from "./text/conditionalExpression.json";
import expressionStatement from "./text/expressionStatement.json";
import identifier from "./text/identifier.json";
import { getNotParseRootParser, getParseRootParser } from "./helper";

function builderTest(name, json: Array<any>, praseFn = getNotParseRootParser) {
  describe(name, () => {
    json.forEach((item, index) => {
      test(`${item.title}__(${index})`, () => {
        const ast = praseFn(item.value);
        const { markers } = Latex.getInstance().getMarkers(item.value, ast);
        // console.log(ast, markers);
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
builderTest("identifier", identifier);
builderTest("expressionStatement", expressionStatement, getParseRootParser);
builderTest("conditionalExpression", conditionalExpression);
