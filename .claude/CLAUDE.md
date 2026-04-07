# CLAUDE.md

Guidance for Claude Code when working with this repository.

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

---

## Plan First — Always

For any task that modifies more than 2 files, adds a dependency, or touches
navigation / native code:

1. Read the relevant files before proposing anything.
2. Produce a phased plan — files to create/modify/delete, risks, open questions.
3. Wait for approval before writing code.
4. Implement one phase at a time. Validate before the next phase.

---

## Available Skills — Load When Relevant

Skills live in `.claude/agents/skills/`. Claude Code reads them automatically when
context matches — but you can also reference them explicitly in prompts.

| Working on… | Skill to apply |
|---|---|
| React Native lists, animations, UI, state | `.claude/agents/skills/vercel-react-native-skills/SKILL.md` |
| Async patterns, server components, bundle perf, re-renders | `.claude/agents/skills/vercel-react-best-practices/SKILL.md` |
| Unit tests, mocks, Jest config | `.claude/agents/skills/javascript-typescript-jest/SKILL.md` |

### Key rules by area (inside the skills above)

**Performance — lists**
`list-performance-virtualize`, `list-performance-item-memo`, `list-performance-images`,
`list-performance-callbacks`, `list-performance-inline-objects`, `list-performance-item-expensive`

**Performance — rendering**
`rerender-memo`, `rerender-derived-state`, `rerender-functional-setstate`,
`rerender-no-inline-components`, `rendering-usetransition-loading`

**State**
`state-ground-truth`, `react-state-minimize`, `react-state-dispatcher`, `react-state-fallback`

**Async / API**
`async-parallel`, `async-api-routes`, `async-dependencies`, `async-suspense-boundaries`

**UI**
`ui-expo-image`, `ui-pressable`, `ui-native-modals`, `ui-safe-area-scroll`,
`ui-styling`, `ui-menus`

**Animations**
`animation-gpu-properties`, `animation-gesture-detector-press`, `animation-derived-value`

---

## MCPs Available

These servers are connected and ready. Use them actively — don't rely on training data
alone for library docs or external endpoints.

| MCP | When to use |
|---|---|
| **context7** | Fetch up-to-date docs for any library (TanStack Query, Zustand, Reanimated, FlashList, etc.). Prefer this over cached knowledge for APIs. |
| **playwright** | Run E2E or component tests against the running app. Use after implementing a feature to verify real behavior. |
| **fetch** | Hit external endpoints directly during development — useful for testing API responses from Rick & Morty API or any REST endpoint before wiring into the app. |
| **memory** | Persist cross-session context: architectural decisions, naming conventions, open TODOs. Write: `Remember that [decision]`. Read: ask for context at session start. |

> **Note:** The GitHub MCP is currently failing to connect. Fix credentials or remove it.

---

## Global Conventions

- **Components**: `components/ComponentName/index.tsx`
- **Hooks**: `hooks/useHookName.ts`
- **Props**: always `interface`, never `type` alias
- **No `any`** — use `unknown` or a precise type
- **`Pressable`** over `TouchableOpacity` — see `ui-pressable.md`
- **`expo-image`** for every image, no exceptions — see `ui-expo-image.md`
- **`useThemeColor`** for colors — never hardcode hex
- **`StyleSheet.create`** for static styles — never inline objects — see `ui-styling.md`
- Platform variants use `.ios.ts` / `.web.ts` suffixes
- Haptics via `expo-haptics` on discrete, intentional interactions
- Lists > ~20 items always use `FlashList` — see `list-performance-virtualize.md`

## Adding Dependencies

Always confirm Expo SDK 54 + New Architecture compatibility before installing.
Use `context7` MCP to check current docs before wiring up any new library.

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
- Do not hardcode colors or use inline style objects

---

## How to Write a Good Prompt

The skills and MCPs don't activate by magic — a precise prompt gets better results.

**Template for new features:**
```
Working on: <feature name>
Files involved: <2-3 files or "new screen">
Goal: <one sentence>

Apply the vercel-react-native-skills for lists/UI and vercel-react-best-practices
for async patterns. Use context7 to check TanStack Query v5 docs before writing
the fetch logic. After implementing, use playwright to verify it renders correctly.
```

**Template for bug fixes:**
```
Bug: <symptom>
File: <file path>
Observed: <what happens>
Expected: <what should happen>

Read the file first, then diagnose before proposing a fix.
```

**Force extended reasoning on hard problems:**
```
ultrathink: <architectural question or stubborn bug>
```

---

## Session Habits

**Start each session with context:**
```
Working on: <feature or bug>
Files involved: <2-3 files>
Goal: <one sentence>
```
Then ask: `"What context do you have from memory about this project?"` — the memory MCP
will surface relevant decisions from past sessions.

**Save decisions before they're lost:**
```
Remember that we use Zustand for UI state and TanStack Query for server state.
Remember that FlashList is always used for character lists, never FlatList.
Remember that the Rick & Morty base URL is https://rickandmortyapi.com/api
```

**Context window — act before quality degrades:**

| Context used | Action |
|---|---|
| ~40% | Normal — continue working |
| ~50% | Run `/compact` — Claude summarizes the session into ~20% context |
| ~70% | Commit all work, save key decisions to memory MCP, then `/clear` |

Signs of degradation: Claude repeats itself, ignores conventions, contradicts
earlier decisions. Don't wait — interrupt and compact early.

**Commit rule:** every completed task, minimum once per hour.
```bash
git add -A && git commit -m "feat|fix|refactor: <what changed>"
```

**When Claude goes off track:**
```
Esc Esc   # interrupt mid-generation
```
```
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

# Fetch fresh docs for a library
"Use context7 to get the latest TanStack Query v5 docs, then implement..."

# Verify with real HTTP before wiring into the app
"Use the fetch MCP to hit https://rickandmortyapi.com/api/character and confirm
 the response shape before writing the types."

# Run tests against the live app
"Use playwright to verify the character list renders and scrolls correctly."

# Bug fixing — paste trace, then:
fix

# When the solution is a patch on a patch:
"Knowing everything you know now, scrap this and implement the elegant solution."

# Cross-session second opinion:
"Act as a staff engineer who did not write this. What would you do differently?"
```

`ultrathink` activates extended reasoning. Use for arch decisions, bugs that resisted
a first fix, irreversible trade-offs. Not for boilerplate.