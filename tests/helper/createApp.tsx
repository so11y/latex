import { mount } from "@vue/test-utils";
import { NDialogProvider, NNotificationProvider, NMessageProvider } from "naive-ui"
import StoreContain, { StoreContainProvide } from "../../src/components/storeContain"
import Latex from "../../src/features/latex.vue"
import feature, { RootContain } from "../../src/features/index"

export function createSimpleApp(
  slot?: (v: StoreContainProvide) => JSX.Element,
) {
  return mount(() => <NDialogProvider>
    <NNotificationProvider>
      <NMessageProvider>
        <StoreContain>
          {{
            default: (v: StoreContainProvide) => {
              return <>
                <Latex />
                {slot && slot(v)}
                <RootContain id="-1" alias="入口" />
              </>
            }
          }}

        </StoreContain>
      </NMessageProvider>
    </NNotificationProvider>
  </NDialogProvider >, {
    global: {
      plugins: [feature],
    },
  });
}
