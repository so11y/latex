import { InjectionKey, Ref } from "vue";
import { StoreContainProvide, StoreValue } from "./storeContain";

export const ignoredPropsKey = [
  "onWaylayAddChildren",
  "onCanAddChildren",
  "toStringLatex",
  "onActiveFocus",
  "onEncode",
  "onToString",
  "encode",
  "index"
];

export interface Props {
  id: string;
  index?: number;
  latexName: string;
  dept?: number;
  parentId: string;
  isFiled?: boolean;
  componentName?: string;
  data?: Record<string, any>;
  alias: string;
  onWaylayAddChildren?(v: StoreValue, l: LatexComponent): boolean;
  onCanAddChildren?(v: StoreValue): boolean;
  onActiveFocus?(v: StoreValue): boolean;
  onToString?(v: StoreValue): string;
  onEncode?(v: StoreValue, s: StoreContainProvide): Record<string, any>;
}

export interface LatexComponent
  extends Omit<
    Props,
    "onWaylayAddChildren" | "onEncode" | "onCanAddChildren" | "onActiveFocus" | "onToString"
  > {
  onCanAddChildren?(): boolean;
  onWaylayAddChildren?(l: LatexComponent): boolean;
}

export type LatexComponentStore = LatexComponent & {
  hasChildrenBobbleColumn?: Ref<boolean>;
  toStringLatex(): string;
  encode(): Record<string, any>;
  bracket?: Record<string, any>
};

export type ContainLatexComponentStore = LatexComponentStore & ContainProvide;

export interface ContainProvide extends LatexComponent {
  children: Ref<Array<LatexComponent>>;
}



export const FakeFiledInject = Symbol("FakeFiled") as InjectionKey<{
  onActiveFocus?(v: StoreValue, fakeStore: ContainLatexComponentStore, index: number): void;
  labels?: Array<string>
}>
