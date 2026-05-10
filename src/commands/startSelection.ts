import * as vscode from "vscode";
import { activateMode, enableSelectionMode, triggerUpdate } from "../state";

/**
 * Starts navigation mode with selection mode enabled.
 * The selection will extend from the original position to the target.
 */
export function registerStartSelection(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand("haru-flash.startSelection", () => {
    enableSelectionMode();
    activateMode();
    triggerUpdate();
  });
}