# CLAUDE.md

Guidance for Claude Code when working with code in this repository.

---

## Project Overview

Expo / React Native app — TypeScript, file-based routing via Expo Router, tab navigation.
Targets iOS, Android, and Web.

| | |
|---|---|
| React Native | 0.81.5 |
| Expo SDK | 54 |
| React | 19.1.0 |
| TypeScript | 5.9 (strict) |
| Router | Expo Router v6 (file-based) |
| Navigation | React Navigation v7 |
| Animations | Reanimated v4 + react-native-worklets |
| Gestures | Gesture Handler v2 |
| Images | expo-image (never RN core `<Image>`) |
| Icons | @expo/vector-icons + expo-symbols |

## Key Commands

```bash
npm start              # Expo dev server
npm run android        # Android device/emulator
npm run ios            # iOS simulator
npm run web            # Web build
npm run lint           # ESLint via expo lint
```

No test runner configured yet — see `@.claude/rules/testing.md` when added.

---

## Plan First — Always

For any task that modifies more than 2 files, adds a dependency, or touches
navigation / native code:

1. Read the relevant files before proposing anything.
2. Produce a phased plan — files to create/modify/delete, risks, open questions.
3. Wait for approval before writing code.
4. Implement one phase at a time. Validate before the next phase.

Full protocol and output format → `@.claude/rules/planning.md`

---

## Rules — Load When Relevant

| Working on… | Load |
|---|---|
| Any non-trivial task | `@.claude/rules/planning.md` |
| Screens, routing, deep links | `@.claude/rules/navigation.md` |
| Lists, images, animations | `@.claude/rules/performance.md` |
| UI components, forms, theming | `@.claude/rules/components.md` |
| Tests, mocks | `@.claude/rules/testing.md` |

---

## Global Conventions

- **Components**: `components/ComponentName/index.tsx`
- **Hooks**: `hooks/useHookName.ts`
- **Props**: always `interface`, never `type` alias
- **No `any`** — use `unknown` or a precise type
- **`Pressable`** over `TouchableOpacity`
- **`expo-image`** for every image, no exceptions
- **`useThemeColor`** for colors — never hardcode hex
- **`StyleSheet.create`** for static styles — never inline objects
- Platform variants use `.ios.ts` / `.web.ts` suffixes
- Haptics via `expo-haptics` on discrete, intentional interactions

## Adding Dependencies

Always confirm Expo SDK 54 + New Architecture compatibility before installing.

| Need | Library |
|---|---|
| Global state | Zustand |
| Server state | TanStack Query v5 |
| Forms + validation | React Hook Form + Zod |
| Long lists | FlashList |
| Bottom sheets | @gorhom/bottom-sheet |

## DO NOT

- Do not touch `android/` or `ios/` without asking first
- Do not use class components
- Do not use `TouchableOpacity`
- Do not use RN core `<Image>`
- Do not use `FlatList` for lists > ~20 items
- Do not use `any`
- Do not install packages without checking New Architecture compatibility

---

## Session Habits

**Start each session with context:**
```
Working on: <feature or bug>
Files involved: <2-3 files>
Goal: <one sentence>
```

**Context window — act before quality drops:**
- ~50% → `/compact`
- ~75% → commit work, then `/clear`
- Signs of degradation: Claude repeats itself, ignores conventions, contradicts earlier decisions

**Commit rule:** every completed task, minimum once per hour.
```bash
git add -A && git commit -m "feat|fix|refactor: <what changed>"
```

**When Claude goes off track:**
```
Esc Esc   # interrupt mid-generation

# Wrong approach — one sentence redirect
# Output works but feels patchy:
"Knowing everything you know now, scrap this and implement the elegant solution."
# Large drift → /rewind, then restate the task
```

---

## Power Prompts

```
# Deep reasoning on hard problems
ultrathink: <architectural question or stubborn bug>

# Force self-testing before delivery
"Demonstrate that this works before telling me it's done."
"What's the one thing you'd be embarrassed to find wrong after shipping?"

# Delegate isolated work to a subagent
"Use the qa-agent subagent to write tests for <files>."
"Use the perf-agent subagent to audit <files>."
"Use the debug-agent subagent to diagnose: <symptom or paste trace>"

# Bug fixing — paste trace, then:
fix

# When the solution is a patch on a patch:
"Knowing everything you know now, scrap this and implement the elegant solution."

# Cross-session second opinion:
"Act as a staff engineer who did not write this. What would you do differently?"
```

`ultrathink` activates extended reasoning. Use for arch decisions, bugs that resisted
a first fix, irreversible trade-offs. Not for boilerplate.

---

## Agents

Subagents run in isolated context — delegate self-contained work here.

| Agent | When to use |
|---|---|
| `qa-agent` | Write and run tests for any file |
| `perf-agent` | Line-level performance audit |
| `debug-agent` | Visual bugs (screenshot), stack traces, console logs via MCP |

Invoke: `"Use the <agent> subagent to <task>"`

## Commands

Type `/name` in Claude Code to invoke.

| Command | What it does |
|---|---|
| `/new-screen` | Screen + route registration + smoke test |
| `/new-component` | UI component + test |
| `/new-hook` | Hook + test (3 templates: state, TanStack Query, side effect) |
| `/fix-bug` | Diagnosis-first bug fix protocol |
| `/review-pr` | Staff engineer review across 5 dimensions before commit |
| `/feature-builder` | Full feature: plan → implement → test → audit |