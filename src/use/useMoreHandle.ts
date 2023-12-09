import { inject, ref, unref } from "vue";
import { StoreContainProvideKey, StoreValue } from "../components/storeContain";
import {
  ContainLatexComponentStore,
  LatexComponent,
} from "../components/types";

interface MoreProps {
  max: number;
  onInsideWaylayAddChildren(
    v: StoreValue,
    l: LatexComponent,
    i: number
  ): boolean;
}

export function useMoreHandle(props: MoreProps) {
  const store = inject(StoreContainProvideKey)!;

  const handleIndex = ref(-1);

  function onCanAddChildren(v: StoreValue) {
    const contain = unref(v) as ContainLatexComponentStore;
    return contain.children.value.length < props.max;
  }

  function onWaylayAddChildren(v: StoreValue, l: LatexComponent) {
    if (handleIndex.value > -1) {
      const isInterCept = props.onInsideWaylayAddChildren(v, l, handleIndex.value);
      if (isInterCept) {
        const children = v.value.children;
        const ordChild = children.value[handleIndex.value];
        children.value[handleIndex.value] = l;
        if (ordChild) {
          Reflect.deleteProperty(store, ordChild.id);
        }
      }
      return true
    }
    return false;
  }

  function handleActive(value: {
    index: number;
    source: ContainLatexComponentStore;
  }) {
    handleIndex.value = value.index;
    store.setActiveId(value.source.id);
    return true;
  }
  function setInsideIndex(index: number) {
    handleIndex.value = index
  }

  return {
    handleActive,
    onWaylayAddChildren,
    onCanAddChildren,
    setInsideIndex
  };
}
