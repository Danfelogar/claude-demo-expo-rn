# Command: /feature-builder

Orchestrate a complete React Native feature end-to-end.
You coordinate planning, implementation, tests, and an optional performance audit —
gating each phase on explicit approval.

---

## Before starting, ask me:

1. **Feature description** — what does it do, what does the user experience?
2. **Entry point** — how does the user reach this (tab, button, deep link)?
3. **Data source** — static, local state, or remote API?
4. **Priority** — anything to finish today vs defer?

---

## Phase 0 — Read, then plan

Before writing a single line, read:
- `CLAUDE.md` — conventions and DO NOTs
- `package.json` — what is actually installed (do not plan for missing libraries)
- `app/` directory tree — current routing structure
- `components/` and `hooks/` — what exists and can be reused

Then produce a plan using the format in `@.claude/rules/planning.md`.

The plan must include:
- Phases with named goals, each independently deployable
- Files to `create` / `modify` / `delete` per phase
- New dependencies with Expo SDK 54 + New Architecture compatibility check
- Reuse opportunities (existing components or hooks that cover part of the work)
- Risks and open questions

**Gate**: present the plan. Do not proceed to Phase 1 until explicitly approved.
Allow iteration: "adjust phase 2", "split phase 1", "is there a simpler approach?".

---

## Phase 1 — Implementation (one phase at a time)

After plan approval, implement one phase at a time.

Active rules during implementation (load and follow):
- `@.claude/rules/components.md` — for every new component
- `@.claude/rules/navigation.md` — for every new screen or route change
- `@.claude/rules/performance.md` — for any list, image, or animation

Hard rules — enforce without being asked:
- `Pressable` — never `TouchableOpacity`
- `expo-image` — never RN core `<Image>`
- `useThemeColor` — never hardcode colors
- `StyleSheet.create` — never inline style objects for static styles
- No `any` types

**Gate after each phase:**
```
Phase N complete.
Files created/modified: [list]
Anything broken or incomplete: [yes/no + details]

Ready for Phase N+1? Reply "yes" to continue or describe changes needed.
```

Wait for explicit approval before the next phase.

---

## Phase 2 — Tests (qa-agent)

After all implementation phases are approved:

```
Use the qa-agent subagent to write tests for the feature just implemented.

Files to test: <list every new file>

- Test every new component (render, interactions, error state, empty state)
- Test every new hook (initial state, transitions, error case)
- Run the tests and fix failures before reporting back
- Do not modify source files — report any bugs found here
```

**Gate**: review the qa-agent report. If it found bugs, surface them as follow-up
tasks — do not silently fix them mid-orchestration.

---

## Phase 3 — Performance audit (perf-agent, optional)

After tests pass, ask: *"Run a performance audit? Recommended if the feature has lists or animations."*

If confirmed:
```
Use the perf-agent subagent to audit: <list new screens and components>
Focus on: re-render causes, list performance, animation thread, memory cleanup.
```

If a 🔴 Critical issue is found, surface it immediately and ask whether to fix
before marking the feature done.

---

## Final summary

```
## Feature Complete: <feature name>

### Delivered
- [ ] <file> — <what it does>

### Tests
- N cases written — all passing ✅ / N failures ⚠️

### Performance
- Audited ✅ / Skipped
- N issues found (see perf-agent report)

### Follow-up tasks
- [bugs from qa-agent]
- [perf issues from perf-agent]
- [open questions deferred from planning]

### Not implemented (out of scope)
- [explicit list]
```

---

## Failure modes

**Plan does not match the actual codebase**
→ Re-read the specific file that was wrong and revise the plan.

**A phase breaks the app**
→ Stop. Do not continue. Report and ask for a decision.

**qa-agent finds a source bug**
→ Do not fix silently. Add to follow-up tasks.

---

## DO NOT

- Do not implement before the Phase 0 plan is approved.
- Do not proceed to Phase N+1 without explicit sign-off.
- Do not run all phases without gates.
- Do not have qa-agent modify source files.
- Do not mark complete if tests are failing.