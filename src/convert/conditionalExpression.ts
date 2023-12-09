import { decode, encode, newId } from "./index";
import { StoreContainProvide } from "../components/storeContain";
import { ContainLatexComponentStore } from "../components/types";
import { Ast } from "./ast";
import { buildConfig } from "./helper";

export class ConditionalExpression extends Ast {
  static type = "ConditionalExpression";
  encode(v: ContainLatexComponentStore, s: StoreContainProvide) {
    const [test, consequent, alternate] = v.children.value;
    return {
      type: ConditionalExpression.type,
      config: buildConfig(v),
      test: encode(s.getComponent(test.id), s),
      consequent: encode(s.getComponent(consequent.id), s),
      alternate: encode(s.getComponent(alternate.id), s),
    };
  }
  async decodeTemplate(v: Record<string, any>, s: StoreContainProvide) {
    const { test, consequent, alternate } = v as ReturnType<
      ConditionalExpression["encode"]
    >;
    await decode(test, s);
    await decode(consequent, s);
    await decode(alternate, s);
  }

  newIdTemplate(
    v: Record<string, any>,
    s: StoreContainProvide,
    parentId: string
  ) {
    const { config } = v;
    config.parentId = parentId;
    config.id = s.getIncreaseUid();

    const { test, consequent, alternate } = v as ReturnType<
      ConditionalExpression["encode"]
    >;
    newId(test, s, config.id);
    newId(consequent, s, config.id);
    newId(alternate, s, config.id);
  }
}
