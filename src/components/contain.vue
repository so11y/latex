<style lang="scss" scoped>
.latex-contain {
  display: flex;
  padding: 0 4px;
  line-height: 1;

  .bracket-end {
    &::after {
      content: ",";
    }
  }

  &:last-child {
    >.bracket-end {
      &::after {
        display: none;
      }
    }
  }

  &.column_contain {
    .latex-contain__title {
      padding-bottom: 10px;
    }

    .remove {
      bottom: 14px !important;
    }

    :deep(.latex-contain__title) {
      align-self: flex-start;
    }
  }

  input {
    box-sizing: border-box;
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

  .latex-contain__title {
    position: relative;

    .remove {
      width: 100%;
      cursor: pointer;
      display: none;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
      transform: translateY(100%);
    }

    &:hover {
      .remove {
        display: block;
      }
    }
  }
}

.column {
  flex-direction: column;
}

.latex_gap {
  display: flex;

  &.column {
    padding-left: 6px;
  }
}
</style>



<template>
  <div class="latex-contain" :data-id="id" @copy.stop="copy" @paste.stop="paste" :class="{
    column: hasColumn || hasChildrenBobbleColumn,
    column_contain: hasColumn || hasChildrenBobbleColumn,
  }">
    <div :style="{ color: DeptBracketColor[dept] }" class="latex-contain__title">
      <div class="remove" @click="store.removeComponent(uid)">x</div>
      {{ latexName }}<span class="bracket" v-if="!isFiled">(</span>
    </div>
    <template v-if="!isFiled">
      <div class="latex_gap" :class="{
        column: hasColumn || hasChildrenBobbleColumn,
      }">
        <component v-bind="item" :parentId="id" :index="index" :dept="dept + 1" :is="item.componentName"
          v-for="(item, index) in source.children.value" :key="item.id" />
      </div>

      <slot :source="source">
        <input v-if="source.onCanAddChildren!()" type="text" @click="onActiveFocus" />
      </slot>

      <div :style="{ color: DeptBracketColor[dept] }" class="bracket bracket-end">
        )
      </div>
    </template>

  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  unref,
  watch,
} from "vue";
import { StoreValue, StoreContainProvideKey } from "./storeContain";
import { omit } from "lodash-es";
import { useMessage } from "naive-ui";
import {
  ignoredPropsKey,
  type ContainLatexComponentStore,
  type LatexComponent,
  type LatexComponentStore,
  Props,
} from "./types";
import { encode, newId } from "../convert";

const props = withDefaults(defineProps<Partial<Props>>(), {
  dept: 0,
  componentName: "LatexContain",
  isFiled: false,
  data: () => ({}),
});
const message = useMessage();

const defaultData = computed(() => {
  return {
    dot: "",
    breakCount: 2,
    ...props.data,
  };
});

const DeptBracketColor: Record<number, string> = {
  0: "#CC99FF",
  1: "#66CCFF",
  2: "#003366",
  3: "#330066",
};

const store = inject(StoreContainProvideKey)!;
const uid = props.id ?? store.getIncreaseUid();
const children = ref<Array<LatexComponent>>([]);
const hasColumn = computed(
  () => {
    const realChildLength = children.value.filter(child => child.componentName !== "FakeBlock").length
    return realChildLength >= defaultData.value.breakCount
  });
const hasChildrenBobbleColumn = ref(false);

const source = computed(() => {
  const _props = omit(props, ignoredPropsKey);
  return {
    id: uid,
    children,
    ..._props,
    hasChildrenBobbleColumn,
    onWaylayAddChildren(impl: LatexComponent): boolean {
      if (props.onWaylayAddChildren)
        return props.onWaylayAddChildren(source, impl);
      return false;
    },
    onCanAddChildren(): boolean {
      if (props.onCanAddChildren) return props.onCanAddChildren(source);
      return true;
    },
    encode() {
      if (props.onEncode) {
        return props.onEncode(source, store);
      }
      return encode(unref(source), store);
    },
    toStringLatex() {
      try {
        if (props.onToString) {
          return props.onToString(source);
        }
        const childrenLatex = children.value
          .map((i) => {
            const c = store.getComponent(i.id) as LatexComponentStore;
            return c.toStringLatex();
          })
          .join(props.data.dot);
        if (uid === "-1") return childrenLatex;
        return `\\text{${props.alias}}\\left ( ${childrenLatex} \\right ) `;
      } catch (error) {
        console.log("toStringLatex ignore error");
        return "";
      }
    },
  };
}) as StoreValue;

function setParentExpand(bool: boolean) {
  const parent = store.getComponent(
    props.parentId!
  ) as ContainLatexComponentStore;
  if (parent && parent.hasChildrenBobbleColumn) {
    parent.hasChildrenBobbleColumn.value = bool;
  }
}

async function copy() {
  let ast = store.encode(uid);
  let ast_json = JSON.stringify(ast);

  try {
    await navigator.clipboard.writeText(ast_json);
    message.success("复制成功~");
  } catch (error) { }
}

function paste(e: ClipboardEvent) {
  const clipboardData = e.clipboardData;
  if (!(clipboardData && clipboardData.items)) {
    return;
  }
  const content = e.clipboardData!.getData("text/plain");
  try {
    console.log("--");
    // store.setActiveId(uid)
    const data = JSON.parse(content);
    newId(data, store, uid);
    store.decode(data);
  } catch (error) {
    message.success("粘连失败~");
  }
}

watch([hasColumn, hasChildrenBobbleColumn, children], ([a, b]) => {
  setParentExpand(a || b);
});

function onActiveFocus() {
  if (props.onActiveFocus === undefined || props.onActiveFocus(source)) {
    store.setActiveId(uid);
  }
}
onMounted(() => store.addComponent(source));
onUnmounted(() => {
  // setParentExpand(false)
  store.removeComponent(uid);
});
</script>



























































