import * as vscode from "vscode";
import { active, isSelectionMode, labelMap, getSearchQuery } from "./state";
import { FlashConfig } from "./utils/types";

/**
 * Updates all editor decorations based on the current search query.
 * This function:
 * 1. Greys out text when query is empty
 * 2. Finds all matches when query has characters
 * 3. Assigns labels to matches sorted by distance from cursor
 * 4. Applies decorations for dim, match, and label highlighting
 */
export function updateHighlights(
  decorations: {
    dimDecoration: vscode.TextEditorDecorationType;
    matchDecoration: vscode.TextEditorDecorationType;
    labelDecoration: vscode.TextEditorDecorationType;
    labelDecorationQuestion: vscode.TextEditorDecorationType;
  },
  config: FlashConfig,
): void {
  if (!active) {
    return;
  }

  labelMap.clear();

  // If query is empty, grey out everything
  const currentQuery = getSearchQuery();
  if (currentQuery.length === 0) {
    for (const editor of vscode.window.visibleTextEditors) {
      if (isSelectionMode && editor !== vscode.window.activeTextEditor) {
        continue;
      }
      editor.setDecorations(decorations.dimDecoration, editor.visibleRanges);
      editor.setDecorations(decorations.labelDecoration, []);
      editor.setDecorations(decorations.labelDecorationQuestion, []);
    }
    return;
  }

  // Clear dim decorations for non-empty query
  for (const editor of vscode.window.visibleTextEditors) {
    if (isSelectionMode && editor !== vscode.window.activeTextEditor) {
      continue;
    }
    editor.setDecorations(decorations.dimDecoration, []);
  }

  // Find matches in all visible editors
  interface LocationInfo {
    editor: vscode.TextEditor;
    range: vscode.Range;
    matchStart: vscode.Position;
  }

  let allMatches: LocationInfo[] = [];
  let allLabels: LocationInfo[] = [];
  const allUnMatches: LocationInfo[] = [];
  let nextChars: string[] = [];

  for (const editor of vscode.window.visibleTextEditors) {
    if (isSelectionMode && editor !== vscode.window.activeTextEditor) {
      continue;
    }

    const document = editor.document;

    for (const visibleRange of editor.visibleRanges) {
      const startLine = visibleRange.start.line;
      const endLine = visibleRange.end.line;

      // Add dim ranges for lines outside visible range
      const startLineUnMatch = Math.max(0, startLine - 5);
      const endLineUnMatch = Math.min(document.lineCount - 1, endLine + 5);

      allUnMatches.push({
        editor,
        range: new vscode.Range(
          new vscode.Position(startLineUnMatch, 0),
          new vscode.Position(startLine, 0),
        ),
        matchStart: new vscode.Position(startLineUnMatch, 0),
      });

      allUnMatches.push({
        editor,
        range: new vscode.Range(
          new vscode.Position(endLine + 1, 0),
          new vscode.Position(endLineUnMatch, 0),
        ),
        matchStart: new vscode.Position(endLine, 0),
      });

      // Search through visible lines
      for (let lineNum = startLine; lineNum <= endLine; lineNum++) {
        const lineText = document.lineAt(lineNum).text;
        const textToSearch = lineText.toLowerCase();
        const queryToSearch = currentQuery.toLowerCase();

        let index = textToSearch.indexOf(queryToSearch);
        let lastMatchIndex = 0;

        while (index !== -1) {
          const matchStart = new vscode.Position(lineNum, index);
          const matchEnd = new vscode.Position(
            lineNum,
            index + queryToSearch.length,
          );

          // Collect the character after the match for label exclusion
          const nextChar = textToSearch[index + queryToSearch.length];
          if (nextChar) {
            nextChars.push(nextChar);
          }

          allMatches.push({
            editor,
            range: new vscode.Range(matchStart, matchEnd),
            matchStart: matchStart,
          });

          // Label position is right after the match
          const labelStart = new vscode.Position(
            lineNum,
            index + queryToSearch.length,
          );
          const labelEnd = new vscode.Position(
            lineNum,
            index + queryToSearch.length + 1,
          );

          allLabels.push({
            editor,
            range: new vscode.Range(labelStart, labelEnd),
            matchStart: matchStart,
          });

          // Track unmatched text before this match
          if (lastMatchIndex < index) {
            allUnMatches.push({
              editor,
              range: new vscode.Range(
                new vscode.Position(lineNum, lastMatchIndex),
                matchStart,
              ),
              matchStart: new vscode.Position(lineNum, index - 1),
            });
          }

          lastMatchIndex = index + queryToSearch.length;
          index = textToSearch.indexOf(queryToSearch, index + 1);
        }

        // Track remaining unmatched text after last match
        if (lastMatchIndex < textToSearch.length) {
          allUnMatches.push({
            editor,
            range: new vscode.Range(
              new vscode.Position(lineNum, lastMatchIndex),
              new vscode.Position(lineNum, textToSearch.length),
            ),
            matchStart: new vscode.Position(lineNum, textToSearch.length - 1),
          });
        }
      }
    }
  }

  // Sort matches by distance from cursor
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const cursorPos = activeEditor.selection.active;

    function getDistance(pos1: vscode.Position, pos2: vscode.Position): number {
      const lineDiff = pos1.line - pos2.line;
      const charDiff = pos1.character - pos2.character;
      return lineDiff * lineDiff * 10 + charDiff * charDiff + 4;
    }

    allLabels.sort((a, b) => {
      let weightA = 1;
      let weightB = 1;

      if (a.editor !== activeEditor) {
        weightA = 10000;
      }
      if (b.editor !== activeEditor) {
        weightB = 10000;
      }

      const distanceA = getDistance(cursorPos, a.matchStart) * weightA;
      const distanceB = getDistance(cursorPos, b.matchStart) * weightB;
      return distanceA - distanceB;
    });
  }

  // Calculate usable label characters (exclude those already used in text)
  const totalMatches = allMatches.length;
  const allNextChars = [...new Set(nextChars)];

  const useableLabelChars = config.labelKeys
    .split("")
    .filter((c) => !allNextChars.includes(c));

  // Assign labels to matches
  const labelCharsToUse =
    totalMatches > useableLabelChars.length
      ? useableLabelChars.concat(
          Array(totalMatches - useableLabelChars.length).fill("?"),
        )
      : useableLabelChars.slice(0, totalMatches);

  let charCounter = 0;

  // Sort visible editors with active first
  let visibleEditors = vscode.window.visibleTextEditors;
  if (activeEditor) {
    visibleEditors = [
      activeEditor,
      ...vscode.window.visibleTextEditors.filter((e) => e !== activeEditor),
    ];
  }

  // Apply decorations to each editor
  for (const editor of visibleEditors) {
    const decorationOptions: vscode.DecorationOptions[] = [];
    const questionDecorationOptions: vscode.DecorationOptions[] = [];

    editor.setDecorations(
      decorations.matchDecoration,
      allMatches.filter((m) => m.editor === editor).map((m) => m.range),
    );

    editor.setDecorations(
      decorations.dimDecoration,
      allUnMatches.filter((m) => m.editor === editor).map((m) => m.range),
    );

    // Assign labels to matches in this editor
    const ranges = allLabels.filter((m) => m.editor === editor);
    for (let i = 0; i < ranges.length; i++) {
      let char = labelCharsToUse[charCounter];
      charCounter++;

      if (char !== "?") {
        labelMap.set(char, {
          editor: editor,
          position: ranges[i].matchStart,
        });
        decorationOptions.push({
          range: ranges[i].range,
          renderOptions: {
            before: { contentText: char },
          },
        });
      } else {
        questionDecorationOptions.push({
          range: ranges[i].range,
          renderOptions: {
            before: { contentText: "?" },
          },
        });
      }
    }

    editor.setDecorations(decorations.labelDecoration, decorationOptions);
    editor.setDecorations(
      decorations.labelDecorationQuestion,
      questionDecorationOptions,
    );

    if (isSelectionMode) {
      break;
    }
  }
}

/**
 * Registers the updateHighlights command.
 */
export function registerUpdateHighlights(
  context: vscode.ExtensionContext,
  decorations: {
    dimDecoration: vscode.TextEditorDecorationType;
    matchDecoration: vscode.TextEditorDecorationType;
    labelDecoration: vscode.TextEditorDecorationType;
    labelDecorationQuestion: vscode.TextEditorDecorationType;
  },
  config: FlashConfig,
): vscode.Disposable {
  return vscode.commands.registerCommand("haru-flash.updateHighlights", () => {
    updateHighlights(decorations, config);
  });
}
