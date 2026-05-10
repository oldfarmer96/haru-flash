import * as vscode from "vscode";
import { labelMap } from "../state";
import { jump } from "./jump";
import { triggerUpdate, appendToSearchQuery } from "../state";

/**
 * Handles character input during navigation mode.
 *
 * Flow:
 * 1. If the character matches a label, jump to that position and exit
 * 2. Otherwise, append the character to the search query and update highlights
 *
 * @param chr - The character pressed by the user
 */
export function handleInput(chr: string): void {
  if (chr === "space") {
    chr = " ";
  }

  if (!chr) {
    return;
  }

  // Check if this key corresponds to an active jump label
  if (labelMap.size > 0 && labelMap.has(chr)) {
    const target = labelMap.get(chr)!;
    jump(target);
    vscode.commands.executeCommand("haru-flash.exit");
    return;
  }

  // Append typed character to the search query
  appendToSearchQuery(chr);
  triggerUpdate();
}