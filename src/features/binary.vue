<template>
  <Contain :onWaylayAddChildren="onWaylayAddChildren" :data="data" :onCanAddChildren="onCanAddChildren"
    :onToString="onToString" v-slot="{ source }">
    <MoreInput :labels="labels" :source="source" @handle="handleActive" />
  </Contain>
</template>
<script lang="ts" setup>
import { inject, provide, unref } from "vue";
import { StoreContainProvideKey, StoreValue } from "../components/storeContain";
import { ContainLatexComponentStore, FakeFiledInject } from "../components/types";
import MoreInput from "../components/moreInput.vue";
import { useMoreHandle } from "../use/useMoreHandle";
interface Props {
  data?: Record<string, any>;
}

const props = defineProps<Props>();
const store = inject(StoreContainProvideKey)!;
const labels = ["lhs", "rhs"];

provide(FakeFiledInject, {
  labels,
  onActiveFocus(_, f, index) {
    handleActive({
      source: f,
      index
    });
  }
})

const { onCanAddChildren, handleActive, onWaylayAddChildren } = useMoreHandle({
  max: labels.length,
  onInsideWaylayAddChildren() {
    return true;
  },
});

function onToString(v: StoreValue) {
  const contain = unref(v) as ContainLatexComponentStore;
  const childrenLatex = contain.children.value
    .map((item) => store.getComponent(item.id).toStringLatex())
    .join(` ${props.data!.operator} `);
  if (contain.dept === 1) {
    return childrenLatex;
  }
  return `\\left ( ${childrenLatex} \\right ) `;
}
</script>


