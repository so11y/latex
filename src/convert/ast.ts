import { nextTick } from "vue";
import { StoreContainProvide } from "../components/storeContain";
import { ContainLatexComponentStore } from "../components/types";

export abstract class Ast {
  declare static type: string;
  abstract encode(
    v: ContainLatexComponentStore,
    s: StoreContainProvide
  ): Record<string, any>;

  put(v: Record<string, any>, s: StoreContainProvide) {
    const { config } = v;
    const { parentId, latexName, alias, componentName, data, id } =
      config as Required<ContainLatexComponentStore>;
    const prevId = s.getActiveId();
    s.setActiveId(parentId);
    s.putActiveChildren(latexName, alias, componentName, data, id);
    s.setActiveId(prevId);
  }

  async decode(v: Record<string, any>, s: StoreContainProvide) {
    const { config } = v;
    let { bracket } = config as Required<ContainLatexComponentStore>;
    let l = Promise.resolve();
    if (bracket) {
      const brackets: Array<typeof bracket> = [];
      while (bracket) {
        brackets.push(bracket);
        bracket = bracket.bracket;
      }
      while (brackets.length) {
        const prev_bracket = brackets.pop();
        l = l.then(() => nextTick(() => this.put({ config: prev_bracket }, s)));
      }
    }
    await l;
    this.put(v, s);
    await nextTick();
    await this.decodeTemplate(v, s);
  }

  abstract decodeTemplate(v: Record<string, any>, s: StoreContainProvide): Promise<void>;

  newId(v: Record<string, any>, s: StoreContainProvide, parentId: string) {
    let { config } = v;
    let { bracket } = config as Required<ContainLatexComponentStore>;

    if (bracket) {

      const brackets: Array<typeof bracket> = [];
      while (bracket) {
        brackets.push(bracket);
        bracket.id = s.getIncreaseUid();
        bracket = bracket.bracket;
      }

      let prev_bracket = brackets.pop()!;
      prev_bracket.parentId = parentId;
      while (brackets.length && prev_bracket) {
        const current_bracket = brackets.pop()!;
        current_bracket.parentId = prev_bracket.id
        prev_bracket = current_bracket;
      }
      parentId = prev_bracket.id;
    }
    this.newIdTemplate(v, s, parentId);
  }

  abstract newIdTemplate(
    v: Record<string, any>,
    s: StoreContainProvide,
    parentId: string
  ): void;
}


