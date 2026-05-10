import * as vscode from "vscode";
import { FlashConfig } from "./utils/types";

const CONFIG_PREFIX = "haru-flash";

const DEFAULTS: FlashConfig = {
  dimColor: "rgba(128, 128, 128, 0.5)",
  matchColor: "rgb(0,191,255)",
  matchFontWeight: "normal",
  labelColor: "black",
  labelBackgroundColor: "#a3be8c",
  labelQuestionBackgroundColor: "#ebcb8b",
  labelFontWeight: "normal",
  labelKeys: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:'\",.<>/`~\\",
};

/**
 * Loads configuration settings from VS Code workspace.
 * Falls back to defaults if settings are not defined.
 */
export function loadConfig(): FlashConfig {
  const config = vscode.workspace.getConfiguration(CONFIG_PREFIX);

  return {
    dimColor: config.get<string>("dimColor", DEFAULTS.dimColor),
    matchColor: config.get<string>("matchColor", DEFAULTS.matchColor),
    matchFontWeight: config.get<string>("matchFontWeight", DEFAULTS.matchFontWeight),
    labelColor: config.get<string>("labelColor", DEFAULTS.labelColor),
    labelBackgroundColor: config.get<string>("labelBackgroundColor", DEFAULTS.labelBackgroundColor),
    labelQuestionBackgroundColor: config.get<string>("labelQuestionBackgroundColor", DEFAULTS.labelQuestionBackgroundColor),
    labelFontWeight: config.get<string>("labelFontWeight", DEFAULTS.labelFontWeight),
    labelKeys: config.get<string>("labelKeys", DEFAULTS.labelKeys),
  };
}

/**
 * Returns the configuration prefix used in package.json.
 */
export function getConfigPrefix(): string {
  return CONFIG_PREFIX;
}