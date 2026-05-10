# haru-flash

Lightning-fast label-based code navigation for VS Code. Inspired by [flash.nvim](https://github.com/folke/flash.nvim), jump to any visible position with 2-3 keystrokes.

Requires [VSCodeVim](https://github.com/VSCodeVim/Vim) for vim keybindings integration.

## Installation

1. Install from VS Code Marketplace.
2. Add the following configuration to your `settings.json`:

```json
"vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["s"],
      "commands": ["haru-flash.start"],
    },
    {
      "before": ["S"],
      "commands": ["haru-flash.startSelection"],
    },
    {
      "before": ["<BS>"],
      "commands": ["haru-flash.backspace"],
    },
    {
      "before": ["<Esc>"],
      "commands": ["haru-flash.exit"],
    }
]
```

## Usage

- Press `s` in normal mode to activate navigation
- Type characters to search (case-insensitive)
- Press a label character (a, b, c...) to jump to that position
- Press `S` to activate with selection mode
- Press `Backspace` to delete last character or exit if query is empty
- Press `Escape` to exit

## Configuration

This extension contributes the following settings:

- `haru-flash.dimColor`: Color used to dim text (default: `rgba(128, 128, 128, 0.5)`)
- `haru-flash.matchColor`: Color for matched text (default: `rgb(0,191,255)`)
- `haru-flash.labelBackgroundColor`: Label background color (default: `#a3be8c`)
- `haru-flash.labelKeys`: Characters used for labels (default: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:'",.<>/`~\\`)
