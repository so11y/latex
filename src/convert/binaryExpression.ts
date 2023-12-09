import { decode, encode, newId } from "./index";
import { StoreContainProvide } from "../components/storeContain";
import { ContainLatexComponentStore } from "../components/types";
import { Ast } from "./ast";
import { buildConfig } from "./helper";

export class BinaryExpression extends Ast {
  static type = "BinaryExpression";
  encode(v: ContainLatexComponentStore, s: StoreContainProvide) {
    const [left, right] = v.children.value;
    return {
      type: BinaryExpression.type,
      config: buildConfig(v),
      operator: v.latexName,
      left: encode(s.getComponent(left.id), s),
      right: encode(s.getComponent(right.id), s),
    };
  }
  async decodeTemplate(v: Record<string, any>, s: StoreContainProvide) {
    const { left, right } = v as ReturnType<BinaryExpression["encode"]>;
    await decode(left, s);
    await decode(right, s);
  }
  newIdTemplate(
    v: Record<string, any>,
    s: StoreContainProvide,
    parentId: string
  ) {
    const { config } = v;
    config.parentId = parentId;
    config.id = s.getIncreaseUid();

    const { left, right } = v as ReturnType<BinaryExpression["encode"]>;
    newId(left, s, config.id);
    newId(right, s, config.id);
  }

  getTypeName() {
    return BinaryExpression.type;
  }
}
