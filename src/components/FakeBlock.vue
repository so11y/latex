<style scoped>
input {
  border: none;
  outline: none;
  align-self: flex-start;
  text-align: center;
  margin-right: 2px;
  color: #999;
  border: none;
  outline: none;
  width: 30px;
  padding: 0 4px;
  margin-left: 6px;
  border-bottom: 1px solid #999;
  transform: translateY(-4px);
  background: transparent;

  &:disabled {
    cursor: not-allowed;
  }
}
</style>




<template>
  <input :placeholder="placeholder" type="text" @click="handleActive" />
</template>
<script lang="ts" setup>
import { omit } from "lodash-es";
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import { StoreContainProvideKey, StoreValue } from "./storeContain";
import { FakeFiledInject, ignoredPropsKey, LatexComponent } from "./types";

const realContent = inject(FakeFiledInject);

const props = defineProps<{
  id: string;
  componentName: string;
  parentId: string;
  index: number;
}>();
const store = inject(StoreContainProvideKey)!;

const children = ref<Array<LatexComponent>>([]);
const uid = props.id ?? store.getIncreaseUid();
const source = computed(() => {
  const _props = omit(props, ignoredPropsKey);
  return {
    id: uid,
    children,
    ..._props,
    onWaylayAddChildren(impl: LatexComponent): boolean {
      const parent = store.getComponent(props.parentId)
      return parent.onWaylayAddChildren?.(impl) === true
    },

  };
}) as StoreValue;

function handleActive() {
  if (realContent && realContent.onActiveFocus) {
    const parentStore = store.getComponentOrginl(source.value.parentId);
    realContent.onActiveFocus(
      parentStore,
      source.value,
      props.index
    );
  } else {
    store.setActiveId(uid);
  }
}
const placeholder = computed(() => {
  if (realContent && realContent.labels) {
    return realContent.labels[props.index || 0]
  }
  return ""
})
onMounted(() => store.addComponent(source));
onUnmounted(() => {
  store.removeComponent(uid);
});
</script>



























