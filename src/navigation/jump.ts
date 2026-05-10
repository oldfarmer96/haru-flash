import * as vscode from "vscode";
import { isSelectionMode } from "../state";

/**
 * Jumps to the target position in the target editor.
 * If in selection mode, extends the selection from the anchor to the target.
 * If the target is in a different editor, switches to that editor.
 */
export function jump(target: {
  editor: vscode.TextEditor;
  position: vscode.Position;
}): void {
  const targetEditor = target.editor;
  const targetPos = target.position;

  targetEditor.selection = new vscode.Selection(
    isSelectionMode ? targetEditor.selection.anchor : targetPos,
    targetPos
  );

  targetEditor.revealRange(new vscode.Range(targetPos, targetPos));

  if (vscode.window.activeTextEditor !== targetEditor) {
    vscode.window.showTextDocument(targetEditor.document, targetEditor.viewColumn);
  }
}