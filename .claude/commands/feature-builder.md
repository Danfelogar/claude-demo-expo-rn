# Command: /feature-builder

Orchestrate a complete React Native feature end-to-end using specialized subagents.
You do not implement anything directly — you coordinate three agents and gate each
phase on explicit approval.

---

## Before starting, ask me:

1. **Feature description** — what does it do, what does the user experience?
2. **Entry point** — how does the user reach this feature (tab, button, deep link)?
3. **Data source** — static, local state, or remote API?
4. **Priority** — is there anything you want to finish today vs defer?

---

## Orchestration protocol

### Phase 0 — Architecture (arch-agent)

Delegate to `arch-agent`:

```
Use the arch-agent subagent to plan this feature:

Feature: <description from user>
Entry point: <entry point>
Data: <data source>

The agent must read CLAUDE.md, package.json, and the existing app/ and components/
directories before producing the plan. Do not produce a plan from assumptions.
```

**Gate**: Present the plan to the developer. Do not proceed to Phase 1 until
explicitly approved. Allow iteration on the plan ("adjust phase 2", "split phase 1").

---

### Phase 1 — Implementation (main session)

After plan approval, implement **one phase at a time**:

```
Implementing Phase 1 of the approved plan.
Following conventions from CLAUDE.md and .claude/rules/.
```

Implementation rules (enforce these yourself):
- Apply `@.claude/rules/components.md` for every new component
- Apply `@.claude/rules/navigation.md` for every new screen or route change
- Apply `@.claude/rules/performance.md` for any list, image, or animation
- Use `Pressable` — never `TouchableOpacity`
- Use `expo-image` — never RN core `<Image>`
- Use `useThemeColor` — never hardcode colors
- Use `StyleSheet.create` — never inline style objects for static styles
- No `any` types

**Gate between phases**: After each implementation phase, output:
```
Phase N complete.
Files created/modified: [list]
Anything broken or incomplete: [yes/no + details]

Ready for Phase N+1? Reply "yes" to continue or describe any changes needed.
```

Wait for explicit approval before starting the next implementation phase.

---

### Phase 2 — Tests (qa-agent)

After all implementation phases are approved, delegate to `qa-agent`:

```
Use the qa-agent subagent to write tests for the feature just implemented.

Files to test:
<list every new file from the implementation phases>

Requirements:
- Test every new component (render, interactions, error state, empty state)
- Test every new hook (initial state, transitions, error case)
- Run the tests and fix failures before reporting back
- Do not modify source files — report any bugs found to the main session
```

**Gate**: Present the qa-agent report. If it found bugs, open them as follow-up
tasks rather than silently fixing them mid-orchestration.

---

### Phase 3 — Performance audit (perf-agent)

After tests pass, optionally delegate to `perf-agent`:

```
Use the perf-agent subagent to audit the newly implemented files for performance issues.

Files to audit:
<list every new screen and component>

Focus on: re-render causes, list performance, animation thread, memory cleanup.
```

Ask the developer: *"Run a performance audit on the new code? (recommended for screens
with lists or animations)"*

Only run if developer confirms.

---

## Final summary

After all phases complete, output:

```
## Feature Complete: <feature name>

### Delivered
- [ ] <screen or component 1> — <path>
- [ ] <screen or component 2> — <path>
- [ ] <hook> — <path>

### Tests
- N test cases written
- All passing ✅ / N failures ⚠️ (see qa-agent report)

### Performance
- Audited ✅ / Skipped
- N issues found (see perf-agent report)

### Follow-up tasks identified
- [bugs found by qa-agent]
- [performance issues from perf-agent]
- [open questions from arch-agent that were deferred]

### What was NOT implemented (per plan scope)
- [explicit list from arch-agent's "not covered" section]
```

---

## Failure modes to handle

**arch-agent produces a plan that does not match the codebase**
→ Ask the agent to re-read the specific file it got wrong and revise.

**Implementation phase breaks the app**
→ Stop. Do not continue to the next phase. Report the breakage and ask for a decision.

**qa-agent finds a bug in source code**
→ Do not fix it silently. Surface it in the final summary as a follow-up task.

**perf-agent finds a Critical issue**
→ Present it immediately. Ask whether to fix it before marking the feature done.

---

## DO NOT

- Do not implement anything before the arch-agent plan is approved.
- Do not proceed to Phase N+1 without explicit developer sign-off.
- Do not run all phases in one shot without gates — the whole point of the
  orchestrator is human checkpoints between phases.
- Do not have the qa-agent modify source files.
- Do not mark the feature complete if tests are failing.