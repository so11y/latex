import Contain from "../components/contain.vue";
import { h, App } from "vue";
import type { LatexComponent } from "../components/types";
import SingleContain from "./singleContain.vue";
import Filed from "./filed.vue";
import Binary from "./binary.vue";
import Conditional from "./conditional.vue";
import { StoreContainProvide, StoreValue } from "../components/storeContain";
import Bracket from "./bracket.vue";
import FakeBlock from "../components/fakeBlock.vue";
import NumberContain from "./numberContain.vue"

const RootContain = (props: LatexComponent) =>
  h(Contain, {
    latexName: "Root",
    ...(props as any),
    onCanAddChildren(storeValue: StoreValue) {
      const l = storeValue.value.children.value.length;
      return l < 1;
    },
    onEncode(storeValue: StoreValue, store: StoreContainProvide) {
      const [first] = storeValue.value.children.value;
      return store.getComponent(first.id).encode();
    },
  });

export default (app: App<Element>) => {
  app.component("Binary", Binary);
  app.component("Logical", Binary); //逻辑和运算同一个组件
  app.component("Filed", Filed);//字符和数字是同一个组件
  app.component("NumberFiled", Filed);
  app.component("RootContain", RootContain);
  app.component("SingleContain", SingleContain);
  app.component("NumberContain", NumberContain);
  app.component("Conditional", Conditional);
  app.component("Contain", Contain);
  app.component("Bracket", Bracket);
  app.component("FakeBlock", FakeBlock);
};
