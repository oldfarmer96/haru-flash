import * as vscode from "vscode";

import { loadConfig } from "./config";
import { createDecorations } from "./decorations";
import { setUpdateHighlights, active } from "./state";
import { registerStart } from "./commands/start";
import { registerStartSelection } from "./commands/startSelection";
import { registerExit } from "./commands/exit";
import { registerBackspace } from "./commands/backspace";
import { updateHighlights, registerUpdateHighlights } from "./search";
import { handleInput } from "./navigation/handleInput";

/**
 * Main entry point for the haru-flash extension.
 * Sets up all commands, keybindings, and event listeners.
 */
export function activate(context: vscode.ExtensionContext): void {
  // Load configuration
  const config = loadConfig();

  // Create decoration types
  const decorations = createDecorations(config);

  // Set up updateHighlights callback for state triggers
  setUpdateHighlights(() => updateHighlights(decorations, config));

  // Register commands
  context.subscriptions.push(registerStart(context));
  context.subscriptions.push(registerStartSelection(context));
  context.subscriptions.push(registerExit(context, decorations));
  context.subscriptions.push(registerBackspace(context));
  context.subscriptions.push(registerUpdateHighlights(context, decorations, config));

  // Register escape key to exit
  context.subscriptions.push(
    vscode.commands.registerCommand("haru-flash.escape", () => {
      if (active) {
        vscode.commands.executeCommand("haru-flash.exit");
      }
    })
  );

  // Listen to editor scroll/visible range changes
  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorVisibleRanges(() => {
      if (active) {
        updateHighlights(decorations, config);
      }
    })
  );

  // Register all jump commands for each character
  const searchChars = config.labelKeys.split("").concat(["space"]);

  for (const c of searchChars) {
    context.subscriptions.push(
      vscode.commands.registerCommand(`haru-flash.jump.${c}`, () =>
        handleInput(c)
      )
    );
  }
}

/**
 * Cleanup on deactivation.
 */
export function deactivate(): void {
  // Nothing to clean up - all disposables are tracked in subscriptions
}