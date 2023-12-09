import { omit } from "lodash-es";
import { ContainLatexComponentStore, ignoredPropsKey } from "../components/types";
import { StoreContainProvide } from "../components/storeContain";

export function buildConfig(v: ContainLatexComponentStore) {
  const ignorePackOptionKeys = [
    ...ignoredPropsKey,
    "children",
    "hasChildrenBobbleColumn",
    "isLast",
    "isFiled",
    "dept",
  ]
  if (v.data && Object.keys(v.data).length === 0) {
    ignorePackOptionKeys.push("data");
  }
  const _props = omit(v, ignorePackOptionKeys);
  return _props;
}

export function encodeBracket(v: ContainLatexComponentStore, s: StoreContainProvide) {
  const [first] = v.children.value;
  const nest = s.getComponent(first.id);
  nest.bracket = buildConfig(v);
  return nest;
}
