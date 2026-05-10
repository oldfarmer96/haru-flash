import * as vscode from "vscode";

/**
 * Represents a match location with metadata for sorting and rendering.
 */
export interface LocationInfo {
  editor: vscode.TextEditor;
  range: vscode.Range;
  matchStart: vscode.Position;
}

/**
 * Represents a jump target with editor and position.
 */
export interface JumpTarget {
  editor: vscode.TextEditor;
  position: vscode.Position;
}

/**
 * Configuration settings for haru-flash.
 */
export interface FlashConfig {
  dimColor: string;
  matchColor: string;
  matchFontWeight: string;
  labelColor: string;
  labelBackgroundColor: string;
  labelQuestionBackgroundColor: string;
  labelFontWeight: string;
  labelKeys: string;
}

/**
 * Extension state snapshot for logging/debugging.
 */
export interface ExtensionState {
  active: boolean;
  searchQuery: string;
  isSelectionMode: boolean;
  labelMapSize: number;
}