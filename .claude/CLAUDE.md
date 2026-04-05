# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.
Domain-specific rules are split into focused files — always load them when working on the relevant area.

## ⚠️ Planning First — Always

**Never implement before proposing a plan.**
For any task that modifies more than 2 files, adds a dependency, or touches navigation / auth / native code:

1. Produce a phased plan (files affected, risks, tests).
2. Wait for approval.
3. Implement one phase at a time.
4. Validate each phase before proceeding.

Full protocol → `@.claude/rules/planning.md`

## Project Overview

Expo / React Native mobile app using TypeScript, file-based routing via Expo Router, and tab navigation.
Targets iOS, Android, and Web.

| | |
|---|---|
| React Native | 0.81.5 |
| Expo SDK | 54 |
| React | 19.1.0 |
| TypeScript | 5.9 (strict) |
| Router | Expo Router v6 (file-based) |
| Navigation | React Navigation v7 (bottom tabs + native stack) |
| Animations | Reanimated v4 + react-native-worklets |
| Gestures | Gesture Handler v2 |
| Images | expo-image (never RN core `<Image>`) |
| Icons | @expo/vector-icons + expo-symbols |

## Key Commands

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android device/emulator
npm run ios            # Run on iOS simulator
npm run web            # Run web build
npm run lint           # ESLint via expo lint
npm run reset-project  # Reset to blank starter state
```

No test runner is configured yet. See `@.claude/rules/testing.md` when one is added.

## Domain Rules — Load These When Relevant

| Working on… | Load this file |
|---|---|
| **Any non-trivial task — always load first** | `@.claude/rules/planning.md` |
| Screens, stacks, tabs, deep links | `@.claude/rules/navigation.md` |
| Lists, images, animations, memory | `@.claude/rules/performance.md` |
| Buttons, inputs, layout primitives | `@.claude/rules/components.md` |
| Tests, mocks, coverage | `@.claude/rules/testing.md` |

## Global Conventions

- **Components**: `components/ComponentName/index.tsx`
- **Hooks**: `hooks/useHookName.ts`
- **Props**: always `interface`, never `type` alias
- **No `any`** — use `unknown` or a precise type
- **Pressable** over `TouchableOpacity` everywhere
- **expo-image** for every image, no exceptions
- Platform-specific files use `.ios.ts` / `.web.ts` suffixes
- Haptic feedback via `expo-haptics` on meaningful interactions

## Adding Dependencies

Confirm Expo SDK 54 + New Architecture compatibility before installing.
Canonical choices when the project grows:

| Need | Library |
|---|---|
| Global state | Zustand |
| Server state / caching | TanStack Query v5 |
| Forms + validation | React Hook Form + Zod |
| Long lists | FlashList |
| Bottom sheets | @gorhom/bottom-sheet |
| Date handling | date-fns |

## DO NOT

- Do not touch `android/` or `ios/` native folders without asking first
- Do not use class components
- Do not use `TouchableOpacity`
- Do not use RN core `<Image>`
- Do not use `FlatList` for lists longer than ~20 items — prefer FlashList
- Do not use `any`
- Do not install packages without checking New Architecture compatibility