import * as vscode from "vscode";
import { activateMode, triggerUpdate } from "../state";

/**
 * Starts navigation mode with standard cursor movement.
 * The cursor will move directly to the selected target.
 */
export function registerStart(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand("haru-flash.start", () => {
    activateMode();
    triggerUpdate();
  });
}