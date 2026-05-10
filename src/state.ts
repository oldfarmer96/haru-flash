import * as vscode from "vscode";

/**
 * Global state for the haru-flash extension.
 * These variables track the current navigation mode and search state.
 */

/** Whether the navigation mode is currently active. */
export let active = false;

/** The current search query typed by the user. */
let searchQuery = "";

/**
 * Gets the current search query.
 */
export function getSearchQuery(): string {
  return searchQuery;
}

/**
 * Sets the search query.
 */
export function setSearchQuery(query: string): void {
  searchQuery = query;
}

/**
 * Appends a character to the search query.
 */
export function appendToSearchQuery(char: string): void {
  searchQuery += char;
}

/**
 * Removes the last character from the search query.
 */
export function removeLastCharFromQuery(): string {
  return searchQuery.slice(0, -1);
}

/** Whether selection mode is enabled (for extending selection). */
export let isSelectionMode = false;

/** Map of label characters to their target jump positions. */
export const labelMap: Map<
  string,
  { editor: vscode.TextEditor; position: vscode.Position }
> = new Map();

/** Reference to updateHighlights function, set during activation */
let updateHighlightsFn: (() => void) | null = null;

/**
 * Sets the updateHighlights callback for use in commands.
 */
export function setUpdateHighlights(fn: () => void): void {
  updateHighlightsFn = fn;
}

/**
 * Calls updateHighlights if available.
 */
export function triggerUpdate(): void {
  if (updateHighlightsFn) {
    updateHighlightsFn();
  }
}

/**
 * Activates the navigation mode.
 */
export function activateMode(): void {
  active = true;
  searchQuery = "";
  labelMap.clear();
  vscode.commands.executeCommand("setContext", "haru-flash.active", true);
}

/**
 * Deactivates the navigation mode and resets state.
 */
export function deactivateMode(): void {
  active = false;
  searchQuery = "";
  labelMap.clear();
  vscode.commands.executeCommand("setContext", "haru-flash.active", false);
}

/**
 * Enables selection mode for the navigation.
 */
export function enableSelectionMode(): void {
  isSelectionMode = true;
}

/**
 * Disables selection mode.
 */
export function disableSelectionMode(): void {
  isSelectionMode = false;
}
