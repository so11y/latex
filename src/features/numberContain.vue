<template>
  <Contain :onToString="onToString" :onCanAddChildren="onCanAddChildren" v-slot="{ source }">
    <MoreInput :labels="labels" :source="source" @handle="onActiveFocus" />
  </Contain>
</template>
<script lang="ts" setup>
import { useSingle } from "../use/useSingle"
import MoreInput from "../components/moreInput.vue";
import { inject, unref } from "vue";
import { StoreContainProvideKey, StoreValue } from "../components/storeContain";
import { ContainLatexComponentStore } from "../components/types";
const { labels, onCanAddChildren, onActiveFocus } = useSingle({
  type: "number"
});

const store = inject(StoreContainProvideKey)!;

function onToString(v: StoreValue) {
  const contain = unref(v) as ContainLatexComponentStore;
  const [first] = contain.children.value;
  return store.getComponent(first.id).toStringLatex()
}

</script>


































































