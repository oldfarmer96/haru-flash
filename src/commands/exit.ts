import * as vscode from "vscode";
import { deactivateMode } from "../state";

/**
 * Exits navigation mode and clears all visual decorations.
 */
export function registerExit(
  context: vscode.ExtensionContext,
  decorations: {
    dimDecoration: vscode.TextEditorDecorationType;
    matchDecoration: vscode.TextEditorDecorationType;
    labelDecoration: vscode.TextEditorDecorationType;
    labelDecorationQuestion: vscode.TextEditorDecorationType;
  }
): vscode.Disposable {
  return vscode.commands.registerCommand("haru-flash.exit", () => {
    deactivateMode();

    for (const editor of vscode.window.visibleTextEditors) {
      editor.setDecorations(decorations.dimDecoration, []);
      editor.setDecorations(decorations.matchDecoration, []);
      editor.setDecorations(decorations.labelDecoration, []);
      editor.setDecorations(decorations.labelDecorationQuestion, []);
    }
  });
}