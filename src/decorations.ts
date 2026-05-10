import * as vscode from "vscode";
import { FlashConfig } from "./utils/types";

/**
 * Creates and returns decoration types for dim, match, and label highlighting.
 * These decorations are applied to text editors to provide visual feedback
 * during navigation mode.
 */
export function createDecorations(
  config: FlashConfig
): {
  dimDecoration: vscode.TextEditorDecorationType;
  matchDecoration: vscode.TextEditorDecorationType;
  labelDecoration: vscode.TextEditorDecorationType;
  labelDecorationQuestion: vscode.TextEditorDecorationType;
} {
  const dimDecoration = vscode.window.createTextEditorDecorationType({
    color: config.dimColor,
  });

  const matchDecoration = vscode.window.createTextEditorDecorationType({
    color: config.matchColor,
    fontWeight: config.matchFontWeight as "normal" | "bold",
  });

  const labelDecoration = vscode.window.createTextEditorDecorationType({
    before: {
      color: config.labelColor,
      backgroundColor: config.labelBackgroundColor,
      fontWeight: config.labelFontWeight as "normal" | "bold",
    },
  });

  const labelDecorationQuestion = vscode.window.createTextEditorDecorationType({
    before: {
      color: config.labelColor,
      backgroundColor: config.labelQuestionBackgroundColor,
      contentText: "?",
      fontWeight: config.labelFontWeight as "normal" | "bold",
    },
  });

  return {
    dimDecoration,
    matchDecoration,
    labelDecoration,
    labelDecorationQuestion,
  };
}

/**
 * Clears all decorations from all visible text editors.
 * Used when exiting navigation mode.
 */
export function clearAllDecorations(
  editors: readonly vscode.TextEditor[],
  dimDecoration: vscode.TextEditorDecorationType,
  matchDecoration: vscode.TextEditorDecorationType,
  labelDecoration: vscode.TextEditorDecorationType,
  labelDecorationQuestion: vscode.TextEditorDecorationType
): void {
  for (const editor of editors) {
    editor.setDecorations(dimDecoration, []);
    editor.setDecorations(matchDecoration, []);
    editor.setDecorations(labelDecoration, []);
    editor.setDecorations(labelDecorationQuestion, []);
  }
}