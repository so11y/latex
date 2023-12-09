import { LatexComponent } from "../components/types"
import { ComponentName } from "./constName";


export function inspectType(l: LatexComponent, name: ComponentName) {
  return l.componentName === name || l.latexName === name
}
