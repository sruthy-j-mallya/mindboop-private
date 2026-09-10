# Split shadcn UI components

Use this command when the user names or @-mentions an **installed shadcn component** (typically a CLI-generated file under `src/components/ui/`, e.g. `label.tsx`, `field.tsx`) that should follow this repo’s UI organization.

Default location: `src/components/ui/`.

## Choose the layout first

Do **not** always create a folder. Pick **one** of these layouts:

### 1. Single file (no folder, no `index.ts`)

Use this when the primitive is **one React component** and it does **not** need a shared `utils.ts` or `types.ts`.

Examples: `Label`, `Separator`.

```
src/components/ui/Label.tsx      ← default export only
src/components/ui/Separator.tsx  ← default export only
```

- **One file**: `src/components/ui/<Name>.tsx` (PascalCase filename).
- **Export**: `export default ComponentName` (arrow function, no barrel).
- **Consumers** default-import the file:

```ts
import Label from "@/components/ui/Label";
import Separator from "@/components/ui/Separator";
```

- **Do not** create `src/components/ui/<Name>/` or `index.ts` for this case.

If a later change adds `cva` variants, shared helpers, or shared types, **then** promote the file into a folder module (layout 2).

### 2. Folder module (PascalCase directory + barrel)

Use this when **any** of the following is true:

- More than one public React component (subcomponents): `Card`, `Field`, `Dialog`.
- Shared non-component code: `cva` maps, helpers → `utils.ts` (`Button`, `Badge`).
- Shared TypeScript types used by more than one piece → `types.ts` (`Card`, `Field`).

```
src/components/ui/Field/
  Field.tsx              ← default export
  FieldLabel.tsx         ← default export
  FieldError.tsx         ← …
  types.ts               ← types only (optional)
  utils.ts               ← cva / helpers only (optional)
  index.ts               ← named re-exports of components only
```

Same idea as `Card/`, `Button/`, `Badge/`.

## What to do

1. **Identify** the component from the user’s message or attached files.
2. **Decide layout** using the rules above (single file vs folder).
3. **Restructure**:
   - Single component, no utils/types → one PascalCase `.tsx` at `src/components/ui/<Name>.tsx`.
   - Otherwise → PascalCase folder `src/components/ui/<Name>/`, **one `.tsx` per public subcomponent** (`Field.tsx`, `FieldLabel.tsx`, …).
4. **If using a folder**, add `index.ts` at the folder root. Consumers import **only components** from `@/components/ui/<Name>`, not from individual `.tsx` files.
5. **Update all imports** in the repo to the matching consumer style (default import vs barrel named import).
6. **Remove** the old CLI flat file(s) (`field.tsx`, `label.tsx`, …) once nothing references them.
7. **Match existing project style** (imports, `cn` from `@/lib/utils`, Tailwind classes).

## Implementation rules (`*.tsx` component files)

These apply to **both** single-file primitives and files inside a folder module.

- **One component per file**: each `*.tsx` defines **exactly one** React component—no second component, no `cva()`, no free-standing helpers, no variant maps inline in that file.
- **Export**: **`export default`** that single component only. Use **`export default ComponentName`** with an arrow-function component (no inline `export default function`).
- **Imports**: `import * as React from "react"` when the React namespace is needed. Import primitives from **Base UI** (this project) or Radix with **aliases** when the local name conflicts, e.g. `import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"`.
- **Styling**: merge classes with `cn` from `@/lib/utils`; spread `className` **after** the base string.
- **Props typing**: `React.ComponentProps<typeof SomePrimitive>` (or `React.ComponentProps<"div">` for plain elements); extend with `& { ... }` only when adding props. For props driven by shared `cva` in `./utils`, use `VariantProps<typeof relevantExport>` from `class-variance-authority` in the component file.
- **DOM markers**: set `data-slot="..."` on the outer element of each piece for selectors and group styling (`group/field`, etc.).

## Module `utils.ts` (folder modules only)

- **When**: the module has `cva` variant maps, small pure helpers, or shared constants. If the only code is one component with inline classes and **no** `cva`/helpers, **do not** create a folder just to add an empty `utils.ts`—use the single-file layout.
- **Purpose**: hold **any non-component code** the module’s pieces need. Component `*.tsx` files stay component-only.
- **Scope**: `utils.ts` is for use **inside** `ui/<Name>/` only. Sibling files import from `./utils`.
- **Not public API**: **do not** re-export anything from `utils.ts` in `index.ts`.

## Module `types.ts` (folder modules only)

- **When**: types/interfaces are shared across files in the folder (see also `.agents/rules/structuring-code.md`).
- **Scope**: import from `./types` inside the folder.
- **Not public API**: **do not** re-export types from `index.ts` unless a consumer already needs them; default is components only.

A **single** component that only needs a local props type can keep that type in its `.tsx` file. Create `types.ts` when types are reused or would clutter the component.

## Barrel (`index.ts`) (folder modules only)

- Exists **only** for folder modules. Single-file primitives (`Label.tsx`, `Separator.tsx`) **must not** have an `index.ts`.
- Default-import each public subcomponent `*.tsx`, then **named re-export** those components only.

```ts
import Field from "./Field";
import FieldLabel from "./FieldLabel";

export { Field, FieldLabel /* …all public subcomponents */ };
```

- **Never** add `export { … }` entries for symbols from `./utils` or `./types`.
- Keep the barrel’s exports in sync with real usage under `src/`.

## Consumer imports

Single file (default export, no barrel):

```ts
import Label from "@/components/ui/Label";
```

Folder module (named exports from the barrel):

```ts
import { Field, FieldLabel, FieldError } from "@/components/ui/Field";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
```

Do not import folder internals:

```ts
// bad
import FieldLabel from "@/components/ui/Field/FieldLabel";
```

## Done when

- Layout matches the decision: **single file** if one component and no `utils`/`types`; **folder** if sub-components and/or `utils.ts`/`types.ts`.
- Folder modules: one default-exported component per `*.tsx`, helpers in `utils.ts`, types in `types.ts`, barrel exports **components only**.
- Single-file primitives: default export only, no `index.ts`.
- No broken imports; typecheck/lint clean for edited files.
- CLI leftover lowercase files (e.g. `popover.tsx`) are replaced by the chosen layout and imports are updated.
