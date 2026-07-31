# Pomodoro
A minimal, macOS-inspired Pomodoro timer built as a desktop app with Electron.

![Pomodoro App](assets/appDemo.pmg)

## Overview

This is a frameless, desktop Pomodoro timer with a custom title bar, three session modes (pomodoro / short break / long break), and automatic cycling through the standard 25-5-15 Pomodoro Technique — with a long break every 4th work session.

## Features

- **25 / 5 / 15 minute cycle** — standard work, short break, and long break durations
- **Automatic session progression** — after 4 completed pomodoros, the next break is automatically a long break instead of a short one
- **Pomodoro counter** — tracks completed work sessions across the app's lifetime
- **Custom frameless window** — no native OS title bar; a custom-drawn title bar with macOS-style traffic light controls (close / minimize) instead
- **Manual mode switching** — jump directly to pomodoro, short break, or long break at any time
- **Start / pause / reset controls** — full control over the active countdown

## Tech Stack

- **Electron** — desktop app shell and windowing
- **HTML / CSS / JavaScript** — UI and timer logic (no frontend framework)
- **electron-builder** — packages the app into a distributable Windows installer

## Project Structure

```
pomodoro/
├── assets/
│   └── bgImg.jpg        # background image
├── build/
│   └── icon.ico          # app icon used by electron-builder
├── index.html             # app markup
├── main.js                # Electron main process (window creation, IPC handlers)
├── preload.js              # contextBridge — exposes safe window controls to the renderer
├── script.js               # timer logic and UI event handling
├── styles.css               # app styling
├── package.json
└── package-lock.json
```

## Architecture Notes

The app uses Electron's recommended security model rather than disabling context isolation:

- `main.js` runs with full Node/Electron access and owns the actual `BrowserWindow` instance.
- `preload.js` runs in an isolated bridge context and exposes exactly two functions to the renderer via `contextBridge`: `close()` and `minimize()`.
- `script.js` (the renderer) never touches Node or Electron APIs directly — it only calls `window.windowControls.close()` / `.minimize()`, which are relayed to the main process over IPC (`ipcMain.on(...)` / `ipcRenderer.send(...)`).

This means the custom title bar's close/minimize buttons work without exposing the full Node/Electron API surface to the webpage, since `contextIsolation: true` is enabled in `main.js`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (includes npm)

### Installation

```bash
git clone https://github.com/vnavirr/pomodoro.git
cd pomodoro
npm install
```

If npm reports pending install scripts (from `electron` or `electron-winstaller`), approve them so Electron's binary downloads correctly:

```bash
npm approve-scripts --allow-scripts-pending
```

### Run in development

```bash
npm run start
```

This launches the app via `electron .`, using your local Node/Electron install — no build step required for day-to-day development.

## Building a Distributable

This project uses [electron-builder](https://www.electron.build/) to package the app into a standalone Windows installer.

```bash
npm run build
```

This produces a `dist/` folder containing an NSIS installer (e.g. `Pomodoro Setup 1.0.0.exe`). Running that installer creates a normal Windows application — Start Menu entry, desktop shortcut, and uninstaller included — independent of Node, npm, or this repository.

> **Note:** the built installer is currently unsigned, so Windows SmartScreen may show a warning on first run. This is expected for a locally-built, non-code-signed app and does not indicate a problem with the build.

## Usage

- **Start** — begins the countdown for the current mode
- **Pause** — stops the countdown without resetting it
- **Reset** — resets the countdown back to the full duration of the current mode
- **pomodoro / short break / long break** — switch modes manually at any time; switching modes stops any active countdown

## Roadmap / Possible Improvements

- [ ] Persist pomodoro count across app restarts
- [ ] Desktop notifications on session end
- [ ] Configurable session durations
