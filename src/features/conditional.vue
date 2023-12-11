<template>
  <Contain :onCanAddChildren="onCanAddChildren" :onWaylayAddChildren="onWaylayAddChildren" :onToString="onToString"
    v-slot="{ source }">
    <MoreInput :labels="labels" :source="source" @handle="handleActive" />
  </Contain>
</template>
<script lang="ts" setup>
import { inject, provide, unref } from "vue";
import { StoreContainProvideKey, StoreValue } from "../components/storeContain";
import { ContainLatexComponentStore, FakeFiledInject } from "../components/types";
import { useMoreHandle } from "../use/useMoreHandle";
import { inspectType } from "../use/helper";
import { ComponentName } from "../use/constName";
import { useMessage } from "naive-ui";
import MoreInput from "../components/moreInput.vue";
const store = inject(StoreContainProvideKey)!;
const message = useMessage();
const labels = ["条件", "true", "false"];

const { onCanAddChildren, handleActive, onWaylayAddChildren } = useMoreHandle({
  max: labels.length,
  onInsideWaylayAddChildren(_, l, i) {
    if (i === 0 && !inspectType(l, ComponentName.Logical)) {
      message.warning("条件位置只能添加逻辑运算");
      return false;
    }
    return true;
  },
});
provide(FakeFiledInject, {
  labels,
  onActiveFocus(_, f, index) {
    handleActive({
      source: f,
      index
    });
  }
})

function onToString(v: StoreValue) {
  const { children } = unref(v) as ContainLatexComponentStore;
  const [test, consequent, alternate] = children.value;

  const testLatex = store.getComponent(test.id).toStringLatex();
  const consequentLatex = store.getComponent(consequent.id).toStringLatex();
  const alternateLatex = store.getComponent(alternate.id).toStringLatex();

  return `\\left ( ${testLatex} ? ${consequentLatex} : ${alternateLatex} \\right ) `;
}
</script>




