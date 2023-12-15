import { parse } from "../../src/analysis/parse";

const parseOption = {
  ecmaVersion: "latest",
  sourceType: "script",
  locations: true,
};
//@ts-ignore
class NotParseRootParser extends parse {
  parse(this: any) {
    const node = this.startNode();
    this.nextToken();
    node.body = [this.parseMaybeAssign()];
    return this.finishNode(node, "Program");
  }
}

export function getNotParseRootParser(value: string) {
  //@ts-ignore
  return new NotParseRootParser(parseOption, value).parse();
}
export function getParseRootParser(value: string) {
  //@ts-ignore
  return new parse(parseOption, value).parse();
}
