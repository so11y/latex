import { vi, describe, expect, test, } from "vitest"
import { createSimpleApp } from "./helper/createApp"
import { NButton } from "naive-ui"
import StoreContain, { StoreContainProvide } from "../src/components/storeContain"
import { nextTick } from "vue"
import { DOMWrapper, VueWrapper } from "@vue/test-utils"

describe("mount", () => {
  test("mount app", () => {
    const app = createSimpleApp();
    expect(app.html()).toMatchSnapshot();
  })

  test("create latex", async () => {
    expect.assertions(1);
    let store: StoreContainProvide
    const app = createSimpleApp((s) => {
      store = s;
      return <>
        <NButton onClick={
          () => s.putActiveChildren('Number', '数值', 'NumberContain')
        } />
      </>
    });
    const input =
      app.getComponent(
        StoreContain
      ).get('[data-id="-1"] > input');

    (input.element as HTMLInputElement).click();
    //@ts-ignore
    if (store) {
      expect(store.getActiveId()).toBe("-1")

      store.putActiveChildren(
        'Count', '数据量', 'SingleContain'
      )
      const current_id = store.getIncreaseUid(true);
      await nextTick();
      store.setActiveId(current_id);


      const count_input = app.get(`[data-id="${current_id}"] > span > input`);

      (count_input.element as HTMLInputElement).click()
      const count_current_id = store.getIncreaseUid(true)

      await nextTick()
      const dialog_input = document.querySelector(".n-input__input-el") as HTMLInputElement;
      await nextTick();
      const wraper = new DOMWrapper(dialog_input)

      wraper.setValue("xixi")
      // wraper.element.value

      const dialog_buttons = document.querySelector(".n-dialog__action");
      (dialog_buttons?.children.item(1) as HTMLButtonElement).click();

      await nextTick();


      expect(app.html()).toMatchSnapshot();

      console.log(
        app.html()
      )
      // console.log(
      //   store.encode(current_id)
      // );
    }



  })
})
