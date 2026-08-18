# PR: Setup Tauri (desktop + Android + iOS)

**Branch:** `setup-tauri`
**Base:** `main` (`820f738` — first commit)
**HEAD:** `431d8fb`

This document records the work done in this setup run so it can be used as a pull-request description and as a local reference.

## Summary

- Scaffolded a **Tauri 2 + React + TypeScript (Vite)** app named `mindboop`.
- Installed JS dependencies with **pnpm**, including an `approve-builds` pass for `esbuild`.
- Generated **Android** (`src-tauri/gen/android`) and **iOS** (`src-tauri/gen/apple`) project trees.
- Installed **macOS Homebrew tools** (Apple Silicon) required for iOS init; those tools live on the machine, not in this repo.

App identifier: `com.sruthyjmallya.mindboop`
Product name / crate: `mindboop`
Frontend: React 19, Vite 7, TypeScript 5.8
Rust: Tauri 2 (`staticlib` / `cdylib` / `rlib` for mobile)

## What changed in the repo

### 1. `pnpm create tauri-app`

Wizard answers (current directory was not empty; overwrite was confirmed):

| Prompt | Selection |
| --- | --- |
| Project name | `.` (scaffold into the existing repo directory) |
| Package name | `mindboop` |
| Identifier | `com.sruthyjmallya.mindboop` |
| Choose `yes` to overwrite if directory is not empty | **Yes** |
| Choose which language to use for your frontend | TypeScript / JavaScript — (pnpm, yarn, npm, deno, bun) |
| Choose your package manager | **pnpm** |
| Choose your UI template | **React** (https://react.dev/) |
| Choose your UI flavor | **TypeScript** |

CLI then printed `Template created!` and suggested:

- Get started: `pnpm install`, `pnpm tauri android init`, `pnpm tauri ios init`
- Desktop: `pnpm tauri dev`
- Android: `pnpm tauri android dev`
- iOS: `pnpm tauri ios dev`

Scaffolded files:

- Frontend: `src/` (`App.tsx`, Vite entry), `index.html`, `vite.config.ts`, `tsconfig*.json`
- Tauri: `src-tauri/` (`Cargo.toml`, `src/lib.rs` with `greet` command, `tauri.conf.json`, icons, capabilities)
- Package scripts: `dev`, `build`, `preview`, `tauri`
- Ignore rules for `node_modules`, `dist`, editor files

Dev URL is `http://localhost:1420`; `beforeDevCommand` / `beforeBuildCommand` use `pnpm`.

### 2. `pnpm approve-builds` + `pnpm install`

- Added `pnpm-lock.yaml` and `pnpm-workspace.yaml`.
- `pnpm-workspace.yaml` records `allowBuilds.esbuild: false` after the approve-builds prompt (esbuild postinstall was not allowed). Re-run `pnpm install` after that so the lockfile and `node_modules` are consistent.

### 3. `pnpm tauri android init`

Generated the Android Gradle project under `src-tauri/gen/android/`:

- Package / Kotlin plugin path: `com.sruthyjmallya.mindboop`
- `MainActivity.kt`, Gradle wrapper, launcher icons, `AndroidManifest.xml`, Rust Gradle plugin (`RustPlugin.kt` / `BuildTask.kt`)

### 4. `pnpm tauri ios init`

Generated the Apple project under `src-tauri/gen/apple/`:

- XcodeGen `project.yml`, `mindboop.xcodeproj`, iOS scheme, Podfile, assets, `Info.plist`
- Bundle ID prefix: `com.sruthyjmallya.mindboop`
- iOS deployment target: **14.0**
- Pre-build script: `pnpm tauri ios xcode-script` to compile Rust into `libapp.a`

Init needed extra Homebrew packages (see below). Those installs are **not** git commits.

## Machine setup (not in git)

On Apple Silicon, iOS init required Homebrew packages installed with `arch -arm64`:

```bash
arch -arm64 brew install xcodegen
arch -arm64 brew install libimobiledevice
arch -arm64 brew install cocoapods
```

`pnpm tauri ios init` was retried after each missing tool until it succeeded.

## Reproduce locally

Prerequisites: Node/pnpm, Rust, Xcode (iOS), Android SDK (Android).

```bash
git clone git@github.com:sruthy-j-mallya/mindboop-private.git
cd mindboop-private
git checkout setup-tauri
pnpm install
# if native build scripts are blocked:
# pnpm approve-builds && pnpm install

pnpm tauri dev          # desktop
# pnpm tauri android init   # already done on this branch
# pnpm tauri ios init       # already done on this branch
```

Last command in this run: `pnpm tauri dev` (desktop dev server + native window).

## Test plan

- [ ] `pnpm install` completes on a clean clone.
- [ ] `pnpm tauri dev` opens the desktop window and the Vite greet UI works (Rust `greet` command).
- [ ] Android: open `src-tauri/gen/android` / `pnpm tauri android dev` with an emulator or device.
- [ ] iOS: CocoaPods + XcodeGen already generated; `pnpm tauri ios dev` (or Xcode) builds for simulator/device.
- [ ] Confirm identifier `com.sruthyjmallya.mindboop` is acceptable for store / signing later.

## Scope / non-goals

- No product UI beyond the Tauri template greet screen.
- No CI, signing, or store listing.
- Homebrew packages are documented here but not version-pinned in the repo.
