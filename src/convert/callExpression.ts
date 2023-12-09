import { decode, encode, newId } from "./index";
import { StoreContainProvide } from "../components/storeContain";
import { ContainLatexComponentStore } from "../components/types";
import { Ast } from "./ast";
import { buildConfig } from "./helper";

export class CallExpression extends Ast {
  static type = "CallExpression";
  encode(v: ContainLatexComponentStore, s: StoreContainProvide) {
    const [first] = v.children.value;
    return {
      type: CallExpression.type,
      config: buildConfig(v),
      callee: v.latexName,
      argument: encode(s.getComponent(first.id), s)
    };
  }
  async decodeTemplate(v: Record<string, any>, s: StoreContainProvide) {
    const { argument } = v as ReturnType<CallExpression["encode"]>;
    await decode(argument, s);
  }
  newIdTemplate(
    v: Record<string, any>,
    s: StoreContainProvide,
    parentId: string
  ) {
    const { config } = v;
    config.parentId = parentId;
    config.id = s.getIncreaseUid();

    const { argument } = v as ReturnType<CallExpression["encode"]>;
    newId(argument, s, config.id);
  }
}

