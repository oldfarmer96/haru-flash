import * as vscode from "vscode";
import { getSearchQuery, setSearchQuery, triggerUpdate } from "../state";

/**
 * Handles backspace keypress during navigation mode.
 * - If searchQuery has characters, removes the last one
 * - If searchQuery is empty, exits navigation mode
 */
export function registerBackspace(context: vscode.ExtensionContext): vscode.Disposable {
  return vscode.commands.registerCommand("haru-flash.backspace", () => {
    const query = getSearchQuery();
    if (query.length > 0) {
      setSearchQuery(query.slice(0, -1));
      triggerUpdate();
    } else {
      vscode.commands.executeCommand("haru-flash.exit");
    }
  });
}