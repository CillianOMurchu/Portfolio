# IconShowcase — Code Standards

These rules apply to all files under `src/components/IconShowcase/`. They extend the root `CLAUDE.md`.

---

## The Standard to Write To

Every file should be reviewable by a senior engineer on first pass, without questions. That means: intent is obvious from names, structure is predictable, nothing is repeated, and nothing exists without a reason.

---

## Simplicity

- Solve the problem in front of you. Do not design for hypothetical future requirements.
- If you can delete a line and the code still works, delete it.
- Flat over nested. If you have more than two levels of nesting, something needs to be extracted or restructured.
- Short functions. A function that needs a comment to explain what it does should be split or renamed instead.
- One concept per function. If you find yourself writing "and" when describing what a function does, it does too much.
- Boring and obvious beats clever and flexible every time.

---

## Naming

Names are the most important documentation in a codebase. Get them right.

- Names should read like plain English at the call site.
- Variables and functions are named after what they **represent or do**, not how they work or what they look like.
- Boolean variables start with `is`, `has`, or `can`: `isRunning`, `hasError`, `canSubmit`.
- Arrays are plural nouns. Their items are singular: `steps` / `step`, `fields` / `field`.
- Event handlers describe the action, not the trigger: `submitAnswer` not `handleSubmit`, `resetDemo` not `handleReset`.
- Constants are SCREAMING_SNAKE_CASE. State variables are camelCase.
- Abbreviations are banned unless they are universally understood (`id`, `url`, `cmd`). `s`, `t`, `v`, `c`, `val`, `idx`, `btn` are not acceptable outside a single-line `.map()`.
- If you have to read more than one line to understand what a variable holds, rename it.

---

## Constants and Magic Values

- Every hardcoded value that carries semantic meaning gets a named `const`.
- Name it after what it **represents**, not what it looks like: `PASS_COLOR`, not `GREEN`; `ANIMATION_DELAY_MS`, not `300`.
- All module-level constants are declared at the top of the file, before any functions or components.
- If the same value is needed in more than one file, it lives in a shared module — not copy-pasted.
- Inline object literals with more than two properties are extracted to a named `const` above the `return`.

```ts
// Bad — meaning is buried, value is repeated elsewhere
<div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}>

// Good
const PANEL_STYLE: React.CSSProperties = {
  background: CODE_PANEL_BG,
  border: `1px solid ${SUBTLE_BORDER}`,
  borderRadius: 8,
};
<div style={PANEL_STYLE}>
```

---

## DRY — Don't Repeat Yourself

- Two occurrences of the same thing is a warning. Three is a refactor.
- Don't DRY things that merely look similar. Only extract when the **intent** is the same, not just the shape.
  - Sandi Metz: *"duplication is far cheaper than the wrong abstraction."*
- Repeated inline styles across files → shared constants file.
- Repeated JSX structure within a file → named sub-component in the same file.
- Repeated JSX structure across files → shared component in `demos/components/`.
- Repeated logic across files → utility function in `demos/utils.ts`.

---

## File Structure

Every file follows this order, always:

1. Imports
2. Types and interfaces
3. Module-level constants
4. Pure helper functions (no hooks)
5. Sub-components (if any)
6. Default export component (state → derived values → handlers → JSX)

No logic inside JSX. Ternaries longer than one line are extracted to a named variable above the `return`.

```tsx
// Bad — logic buried in JSX
<button style={{ color: isRunning ? "#4b5563" : allPassed ? "#10b981" : "#3178c6" }}>

// Good — readable at the call site
const buttonColor = isRunning ? DISABLED_COLOR : allPassed ? PASS_COLOR : ACCENT_COLOR;
<button style={{ color: buttonColor }}>
```

---

## Component Design

- Demo components are self-contained — no props, no external dependencies beyond shared constants and utilities.
- Keep the component focused on one thing: one demo, one interaction flow.
- Extract a sub-component when a block of JSX serves a distinct visual role and exceeds ~15 lines. Keep it in the same file unless it's shared.
- 120 lines is the soft limit per file. Past that, something needs to be extracted.
- Use semantic HTML. `<button>` for buttons, not `<div onClick>`. `<input>` for inputs.

---

## TypeScript

- No `any`. If the shape is genuinely unknown, use `unknown` and narrow it.
- Use discriminated unions instead of multiple boolean flags for anything with more than two states:

```ts
// Bad — four possible combinations, three of which are invalid
const [isRunning, setIsRunning] = useState(false);
const [isDone, setIsDone] = useState(false);

// Good — only valid states are representable
type RunState = "idle" | "running" | "done" | "failed";
const [runState, setRunState] = useState<RunState>("idle");
```

- Use `as const` on static data to get literal types automatically.
- Define interfaces above the component. Never inline complex types in JSX props.
- Prefer `type` for aliases and unions; `interface` for object shapes that describe a thing.

---

## State

- Derive values from state — do not store derived state. A piece of state that can be computed from other state should be a `const`, not a `useState`.
- Co-locate state with the component that needs it. Don't hoist unless two siblings share it.
- Reset state atomically — a reset handler touches all related pieces in one pass.
- Clean up any timers, intervals, or subscriptions created in a component before the component unmounts. Use `useRef` to hold mutable timer handles.
- `useCallback` and `useMemo` only after profiling shows a real problem. Premature memoisation adds complexity for no gain.

---

## What a Reviewer Will Reject

A PR should not ship if any of these are present:

- Magic numbers or hex strings without a named constant
- The same inline style object appearing more than once, anywhere
- Variables named `s`, `t`, `v`, `c` outside a single-line `.map()`
- Derived state stored in `useState`
- Timer or subscription created without cleanup
- Multi-line ternary or logic inside JSX
- A function that does more than one thing
- A comment that explains *what* code does (rename instead)
- `any` types
- Multiple boolean flags where a discriminated union would make illegal states unrepresentable
