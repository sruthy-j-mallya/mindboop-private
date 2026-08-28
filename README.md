# MindBoop

MindBoop is a focus-session app built for ADHD brains. It treats rabbit holes as part of how you work, not something to punish — so you can start, wander, and still come back to the thing you meant to do.

## Technologies

Desktop and mobile app on [Tauri 2](https://v2.tauri.app/) with a [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) frontend ([Vite](https://vite.dev/)) and a [Rust](https://www.rust-lang.org/) backend.

## Prerequisites

Install these before cloning:

| Tool | Notes |
| --- | --- |
| [mise](https://mise.en.dev/) | Pins Node and pnpm via `mise.toml` |
| [rustup](https://rustup.rs/) | Official Rust installer |
| [Xcode Command Line Tools](https://developer.apple.com/xcode/) | macOS / desktop builds |

**Android** (optional): Android Studio / SDK, and a device or emulator.

**iOS** (optional, macOS only): Xcode, plus:

```bash
arch -arm64 brew install xcodegen libimobiledevice cocoapods
```

## Setup after cloning

1. Install **Node** and **pnpm** (versions in `mise.toml`):

   ```bash
   mise install
   ```

2. Install project packages:

   ```bash
   pnpm install
   ```

  If pnpm blocks native build scripts (for example `esbuild`), approve them and install again:

  ```bash
  pnpm approve-builds
  pnpm install
  ```

3. **Rust** is handled for you. `rust-toolchain.toml` pins **1.97.1**; rustup installs that toolchain the first time you run `cargo` or `rustc` in this repo. You do not need an extra install step.


## Run the app

**Desktop** (dev server at `http://localhost:1420` plus the native window):

```bash
pnpm tauri dev
```

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
