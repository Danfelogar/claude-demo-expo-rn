# Planning Rules
<!-- important if="starting any new feature, refactor, or non-trivial change" -->

Never implement before a plan is approved.
Applies to: new features, refactors, adding dependencies, touching native code,
any task that modifies more than 2 files.

---

## Protocol

**Step 1 — Request a plan, not code**
```
I want to [feature/change].
Give me a detailed plan first — do NOT implement anything yet.
Include: phases, files to create/modify/delete per phase,
new dependencies (Expo SDK 54 + New Architecture compat check), risks.
```

**Step 2 — Review and adjust** before any code is written.
Challenge assumptions: failure modes, simpler alternatives, rollback plan.

**Step 3 — Approve phase by phase**
```
The plan looks good. Implement phase 1 only. Do not move to phase 2 until I say so.
```

**Step 4 — Validate before continuing**
```
Before phase 2: show me what changed and why, any test output, anything still broken.
```

**Step 5 — Proceed or fix**
```
Phase 1 looks good. Proceed.     OR     Phase 1 has issues: [describe]. Fix first.
```

---

## Plan output format

```
## Plan: [Feature Name]

### Summary
One paragraph — what we're building and why.

### Phases

#### Phase 1 — [Name]
**Goal**: what this delivers as a standalone unit.
**Files**:
- `create` app/(tabs)/profile.tsx
- `modify` app/(tabs)/_layout.tsx
**New dependencies**: none / package@version (New Arch compatible: yes/no)
**Tests**: [list]
**Risks**: [anything that could go wrong]

### What this does NOT cover
[Explicit scope boundary]

### Open questions
[Decisions needed before or during implementation]
```

---

## Subagents for large tasks

For tasks touching 5+ files or with 3+ phases:
```
Use subagents for this. Delegate each phase so the main context stays clean.
```
Good candidates: writing all tests for a module, auditing files for a pattern,
implementing a self-contained screen end-to-end.

---

## Mid-implementation checkpoints

```
# After a phase:
"Summarize what you changed in phase N and why."

# Before touching app.json / android/ / ios/:
"Stop. Tell me what you're about to change and wait for my confirmation."

# If the plan no longer fits:
"Propose an updated plan for remaining phases before continuing."
```

---

## DO NOT

- Do not implement before a plan is reviewed.
- Do not approve all phases at once for complex features.
- Do not proceed to the next phase after an error without explicit approval.