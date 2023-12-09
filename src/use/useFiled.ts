import { NInput, useDialog, useMessage } from "naive-ui";
import { StoreContainProvideKey, StoreValue } from "../components/storeContain";
import { ContainLatexComponentStore } from "../components/types";
import { h, inject, ref, unref } from "vue";

export interface UseFiledProps {
  type: "string" | "number"
}

const handleType = {
  is_string() {
    return {
      title: "输入字段",
      validate() {
        return true;
      },
      componentName: "Filed"
    }
  },
  is_number() {
    return {
      validate(v: string) {
        return /^-?\d+(\.\d+)?$/.test(v);
      },
      title: "输入数字",
      componentName: "NumberFiled"
    }
  }
}

export function useFiled(options: UseFiledProps = { type: "string" }) {
  const chooseType = handleType[`is_${options.type}`]();
  const dialog = useDialog();
  const store = inject(StoreContainProvideKey)!;
  const message = useMessage();
  function onActiveFocus(v: StoreValue, fakeBlobckStore?: ContainLatexComponentStore) {
    const value = ref("");
    const contain = unref(v) as ContainLatexComponentStore;
    dialog.info({
      title: chooseType.title,
      content: () =>
        h(NInput, {
          value: value.value,
          "onUpdate:value"(e) {
            value.value = e;
          },
        }),
      positiveText: "确定",
      negativeText: "不确定",
      onPositiveClick: () => {
        if (chooseType.validate(unref(value))) {
          store.setActiveId(fakeBlobckStore?.id || contain.id);
          store.putActiveChildren(unref(value), unref(value), chooseType.componentName);
        } else {
          message.warning("请检查输入")
        }
      },
    });

    return false;
  }
  return {
    onActiveFocus,
  };
}
