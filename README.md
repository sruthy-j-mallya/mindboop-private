# Mindboop

Focus sessions that respect ADHD brains — and the rabbit holes they chase.

This is a **Tauri 2** desktop (and mobile) app with a **React + TypeScript** frontend (Vite) and a **Rust** backend.

## Prerequisites

Install these before cloning:

| Tool | Notes |
| --- | --- |
| [Node.js](https://nodejs.org/) | LTS |
| [pnpm](https://pnpm.io/installation) | Package manager used by this repo |
| [Rust](https://www.rust-lang.org/tools/install) | `rustup` + stable toolchain |
| [Xcode Command Line Tools](https://developer.apple.com/xcode/) | macOS / desktop builds |

**Android** (optional): Android Studio / SDK, and a device or emulator.

**iOS** (optional, macOS only): Xcode, plus:

```bash
arch -arm64 brew install xcodegen libimobiledevice cocoapods
```

## Setup after cloning

If pnpm blocks native build scripts (for example `esbuild`), approve them and install again:

```bash
pnpm approve-builds
pnpm install
```

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
