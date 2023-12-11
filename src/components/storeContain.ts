import {
  ComputedRef,
  defineComponent,
  InjectionKey,
  provide,
  unref,
  reactive,
  watch,
  ref,
  nextTick,
  Ref,
} from "vue";
import type { ContainProvide, ContainLatexComponentStore } from "./types";
import { decode } from "../convert";

export type StoreValue = ComputedRef<ContainLatexComponentStore>;
export type Store = Record<string, StoreValue>;
export interface StoreContainProvide {
  getIncreaseUid(peek?:    boolean): string;
  getComponent(id: string): ContainLatexComponentStore;
  getComponentOrginl(id: string): StoreValue;
  getActiveId(): string;
  addComponent(i: StoreValue): void;
  removeComponent(id: string): void;
  setActiveId(id: string): void;
  putActiveChildren(
    latexName: string,
    alias: string,
    _componentName?: string,
    data?: Record<string, any>,
    id?: string | null
  ): void;
  toStringLatex: Ref<string>;
  encode(id?: string): Record<string, any>;
  decode(v: Record<string, any>): void;
}
function generateCombinedId() {
  const timestamp = new Date().getTime(); // 获取当前时间戳
  const randomId = Math.random().toString(36).substring(2); // 生成随机字符串
  const combinedId = randomId + '_' + timestamp; // 结合随机字符串和时间戳
  return combinedId;
}
// export const StoreContainProvideKey =  "StoreContainProvideKey"
export const StoreContainProvideKey = Symbol(
  "StoreContainProvideKey"
) as InjectionKey<StoreContainProvide>;

function handleToString(store: Store) {
  let latexString = ref("");
  watch(
    store,
    async () => {
      await nextTick();
      const root = unref(store[-1]);
      latexString.value = root ? root.toStringLatex() : "";
    },
    {
      deep: true,
    }
  );
  return latexString;
}

export default defineComponent({
  setup(_, { slots }) {
    const store = reactive<Store>({});
    let increaseId = generateCombinedId();
    let activeId: string = "-2";

    const toStringLatex = handleToString(store);

    const actions = {
      store,
      getIncreaseUid(peek = false) {
        if (peek) return increaseId;
        increaseId = generateCombinedId();
        return increaseId;
      },
      putActiveChildren(
        latexName,
        alias: string,
        _componentName?: string,
        data = {},
        id: string | null = null
      ) {
        if (activeId !== null) {
          const component = actions.getComponent(activeId);
          if (component) {
            const shareCtx = component as ContainProvide;
            const impl = {
              id: id ?? actions.getIncreaseUid(),
              componentName: _componentName ? _componentName : "Contain",
              latexName,
              parentId: activeId,
              alias,
              data,
            };
            if (shareCtx.onCanAddChildren?.() === false) {
              return;
            }
            if (shareCtx.onWaylayAddChildren?.(impl) === true) {
              return;
            }
            if (shareCtx.componentName === "FakeBlock") {
              const fakeBlockParent = actions.getComponent(shareCtx.parentId)
              const index = fakeBlockParent.children.value.findIndex(child => child.id === shareCtx.id)
              if (index > -1) {
                fakeBlockParent.children.value[index] = impl;
              }
              Reflect.deleteProperty(store, shareCtx.id);
            } else {
              shareCtx.children.value.push(impl);
            }
          }
        }
      },
      getComponentOrginl(i) {
        return store[i]
      },
      getComponent(i) {
        return unref(store[i]);
      },
      addComponent(i) {
        const { value } = i;
        store[value.id] = i;
      },
      removeComponent(i) {
        const self = actions.getComponent(i);
        if (!self || self.parentId === undefined) return;
        const parent = actions.getComponent(self.parentId) as ContainProvide;
        Reflect.deleteProperty(store, i);
        if (parent) {
          const index = parent.children.value.findIndex(
            (child) => child.id === self.id
          );
          const impl = {
            id: actions.getIncreaseUid(),
            componentName: "FakeBlock",
            latexName: "FakeBlock",
            parentId: parent.id,
            alias: "",
            data: {},
          };
          parent.children.value[index] = impl;
        }
      },
      setActiveId(i) {
        activeId = i;
      },
      getActiveId() {
        return activeId;
      },
      toStringLatex,
      encode(id = "-1") {
        const s = actions.getComponent(id).encode();
        console.log(s);
        return s;
      },
      decode(v: Record<string, any>) {
        if (v.config.bracket) {
          let current_bracket = v.config;
          while (current_bracket.bracket) {
            current_bracket = current_bracket.bracket;
          }
          current_bracket.parentId = activeId;
        } else {
          v.config.parentId = activeId;
        }
        decode(v, actions);
      },
    } as StoreContainProvide;
    provide(StoreContainProvideKey, actions);
    return () => {
      return slots.default!(actions);
    };
  },
});
