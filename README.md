# MindBoop

MindBoop is a focus-session app built for ADHD brains. It treats rabbit holes as part of how you work, not something to punish — so you can start, wander, and still come back to the thing you meant to do.

## Technologies

Desktop and mobile app on [Tauri 2](https://v2.tauri.app/) with a [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) frontend ([Vite](https://vite.dev/)) and a [Rust](https://www.rust-lang.org/) backend.

## Prerequisites

Install these before cloning:

| Tool | Notes |
| --- | --- |
| [mise](https://mise.en.dev/) | Pins Node, pnpm and Rust via `mise.toml` |
| [rustup](https://rustup.rs/) | Official Rust installer |
| [Xcode Command Line Tools](https://developer.apple.com/xcode/) | macOS / desktop builds |

**Android** (optional): Android Studio / SDK, and a device or emulator.

**iOS** (optional, macOS only): Xcode, plus:

```bash
arch -arm64 brew install xcodegen libimobiledevice cocoapods
```

## Setup after cloning

Run the setup task once:

```bash
mise run setup
```

This installs the pinned **Node**, **pnpm** and **Rust** versions from `mise.toml`, installs the project's JS packages with `pnpm install`, and downloads the Rust crates for `src-tauri/`.

If pnpm blocks native build scripts (for example `esbuild`), approve them and run setup again:

```bash
mise exec -- pnpm approve-builds
mise run setup
```

## Run the app

**Desktop** (dev server at `http://localhost:1420` plus the native window):

```bash
mise run dev
```

The commands below use pnpm directly. If mise isn't activated in your shell, prefix them with `mise exec --` so they use the pinned pnpm.

**Android** (emulator or device):

```bash
pnpm tauri android dev
```

**iOS** (simulator or device):

```bash
pnpm tauri ios dev
```

Frontend-only (Vite, no native shell):

```bash
pnpm dev
```

### Production build

```bash
pnpm tauri build
```

## Project layout

| Path | What it is |
| --- | --- |
| `src/` | React UI |
| `src-tauri/` | Rust / Tauri config, capabilities, icons |
| `src-tauri/gen/android` | Android Gradle project |
| `src-tauri/gen/apple` | iOS / Xcode project |
