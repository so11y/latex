import { inject, provide } from "vue";
import { StoreContainProvideKey } from "../components/storeContain";
import { ContainLatexComponentStore, FakeFiledInject } from "../components/types";
import { useFiled, type UseFiledProps } from "./useFiled";
import { useMoreHandle } from "./useMoreHandle";

export function useSingle(options: UseFiledProps = { type: "string" }) {
  const store = inject(StoreContainProvideKey)!;
  const labels = [""];

  const { onCanAddChildren } = useMoreHandle({
    max: labels.length,
    onInsideWaylayAddChildren() {
      return true;
    },
  });

  const { onActiveFocus: _onActiveFocus } = useFiled(options);

  function onActiveFocus(value: {
    index: number;
    source: ContainLatexComponentStore;
  }) {
    const storeSource = store.getComponentOrginl(value.source.id)
    _onActiveFocus(storeSource);
  }


  provide(FakeFiledInject, {
    onActiveFocus: _onActiveFocus
  })

  return {
    onCanAddChildren,
    labels,
    onActiveFocus
  }
}
