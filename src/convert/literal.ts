import { StoreContainProvide } from "../components/storeContain";
import { ContainLatexComponentStore } from "../components/types";
import { Ast } from "./ast";
import { buildConfig } from "./helper";

export class Literal extends Ast {
  static type = "Literal";
  encode(v: ContainLatexComponentStore, s: StoreContainProvide) {
    return {
      type: this.getTypeName(),
      config: buildConfig(v),
      value: v.alias,
    };
  }
  decodeTemplate(v: Record<string, any>, s: StoreContainProvide) {

    return Promise.resolve();
  }

  newIdTemplate(
    v: Record<string, any>,
    s: StoreContainProvide,
    parentId: string
  ) {
    let { config } = v;
    config.parentId = parentId;
    config.id = s.getIncreaseUid();
  }
  getTypeName() {
    return Literal.type;
  }
}
export class NumberLiteral extends Literal {
  static type = "NumberLiteral"
  getTypeName() {
    return NumberLiteral.type
  }
}
