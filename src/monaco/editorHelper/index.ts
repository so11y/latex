import * as monaco from "monaco-editor";
import { provideCompletionItems } from "./completion";
import { tokenProvide } from "./tokenProvide";
import { hoverProvider } from "./hoverProvider";
import { inlayHintsProvider } from "./InlayHintsProvider";
import { codeLensesProvide } from "./codeLenseProvide";

export class EditorHelper {
  private static instance: EditorHelper;
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  public static getInstance() {
    if (!EditorHelper.instance) {
      EditorHelper.instance = new EditorHelper();
    }
    return EditorHelper.instance;
  }
  _disposable: Partial<{
    tokenProvideDisposable: monaco.IDisposable;
    completionItemProviderDisposable: monaco.IDisposable;
    hoverProviderDisposable: monaco.IDisposable;
    inlayHintsProviderDisposable: monaco.IDisposable;
    codeLensProviderDisposable: monaco.IDisposable;
  }> = {};
  public setup() {
    monaco.languages.register({ id: "latex" });
    monaco.languages.setLanguageConfiguration("latex", {
      brackets: [["(", ")"]],
    });
    const completionItemProviderDisposable =
      monaco.languages.registerCompletionItemProvider(
        "latex",
        provideCompletionItems()
      );
    const hoverProviderDisposable = monaco.languages.registerHoverProvider(
      "latex",
      hoverProvider()
    );
    const inlayHintsProviderDisposable =
      monaco.languages.registerInlayHintsProvider(
        "latex",
        inlayHintsProvider()
      );
    const codeLensProviderDisposable =
      monaco.languages.registerCodeLensProvider("latex", codeLensesProvide());
    monaco.languages.setMonarchTokensProvider("latex", tokenProvide());

    this._disposable = {
      completionItemProviderDisposable,
      hoverProviderDisposable,
      inlayHintsProviderDisposable,
      codeLensProviderDisposable,
    };
    this.setupTokensProvider();
  }

  setupTokensProvider() {
    if (this._disposable.tokenProvideDisposable) {
      this._disposable.tokenProvideDisposable.dispose();
    }
    this._disposable.tokenProvideDisposable =
      monaco.languages.setMonarchTokensProvider("latex", tokenProvide());
  }

  disposable() {
    this._disposable.tokenProvideDisposable?.dispose();
    this._disposable.completionItemProviderDisposable?.dispose();
    this._disposable.hoverProviderDisposable?.dispose();
    this._disposable.inlayHintsProviderDisposable?.dispose();
    this._disposable.codeLensProviderDisposable?.dispose();
  }
}
