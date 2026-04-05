# Planning Rules
<!-- important if="starting any new feature, refactor, or non-trivial change" -->

Never implement before a plan is approved.
This applies to: new features, refactors, adding dependencies, touching native code, and any task
that modifies more than 2 files.

---

## The Planning Protocol

### Step 1 — Request a Plan (not code)

Use this prompt template to kick off any non-trivial task:

```
I want to [feature/change].

Give me a detailed plan first — do NOT implement anything yet.

Include:
- Implementation phases (ordered, each independently deployable)
- Files to create / modify / delete per phase
- New dependencies needed (with Expo SDK 54 + New Architecture compatibility check)
- Tests to add per phase
- Risks or unknowns I should know about before we start
```

### Step 2 — Review & Adjust

Ask questions, request changes, challenge assumptions before any code is written.
Common follow-up prompts:

```
- "Is there a simpler approach for phase 2?"
- "What could go wrong in phase 1? Give me the failure modes."
- "Are there any Expo SDK 54 / New Architecture gotchas for this?"
- "What's the rollback plan if phase 3 breaks something?"
```

### Step 3 — Approve and Execute Phase by Phase

Never approve the full plan at once and ask for a single implementation dump.
Execute one phase at a time:

```
The plan looks good. Implement phase 1 only.
Do not move to phase 2 until I say so.
```

### Step 4 — Validate Before Continuing

After each phase, ask Claude to validate its own work before you continue:

```
Before we move to phase 2:
- Show me which files were changed and why
- Show me the relevant test output (or how to run it manually)
- Tell me if anything is still broken or incomplete
```

### Step 5 — Proceed or Adjust

```
Phase 1 looks good. Proceed to phase 2.
```
or
```
Phase 1 has issues: [describe]. Fix these before moving on.
```

---

## Plan Output Format

When Claude produces a plan, it must use this structure:

```markdown
## Plan: [Feature Name]

### Summary
One paragraph of what we're building and why.

### Phases

#### Phase 1 — [Name]
**Goal**: What this phase delivers on its own.
**Files**:
- `create` app/(auth)/login.tsx
- `modify` app/_layout.tsx
- `modify` constants/theme.ts

**New dependencies**: none / `expo-local-authentication@~15.x`
**Tests**: [list tests to add]
**Estimated complexity**: low / medium / high
**Risks**: [anything that could go wrong]

#### Phase 2 — [Name]
...

### What This Plan Does NOT Cover
[Explicitly list what's out of scope]

### Open Questions
[Anything that needs a decision before or during implementation]
```

---

## Subagents for Large Tasks

For tasks that touch 5+ files or have 3+ phases, instruct Claude to use subagents:

```
Use subagents for this task. Delegate each phase to a subagent
so the main context stays clean. Report back when each phase is done.
```

Why: subagents run in isolated contexts, keeping the main session's context window
from filling up with implementation noise. The orchestrating agent coordinates and reports.

Good candidates for subagents:
- Writing all tests for a module
- Implementing a self-contained screen or flow end-to-end
- Migrating a set of components to a new pattern
- Auditing files for a specific issue (e.g. "find all FlatList usages")

---

## Plan Templates by Feature Type

### New Screen / Flow

```
I want to add [screen name] to the app.

Plan only — no implementation yet.

The screen should: [describe behavior]
Entry point: [where does the user navigate from]
Data needed: [what data does it display / mutate]

Include phases, files, navigation changes, and any new hooks or services needed.
```

### New Dependency

```
I want to add [library] to the project.

Before implementing, give me a plan that covers:
- Is it compatible with Expo SDK 54 and New Architecture?
- What do we need to configure (app.json, babel, metro)?
- What existing code will need to change?
- Is there an Expo-managed alternative we should consider first?

Do not install anything yet.
```

### Refactor

```
I want to refactor [area of codebase] to [goal].

Plan only — no code changes yet.

Include:
- Why this refactor is worth doing (confirm my reasoning or push back)
- The sequence of changes to avoid breaking the app mid-refactor
- How we verify the refactor didn't break anything
- Files affected
```

### Bug Fix

```
Bug: [describe the bug and how to reproduce it]

Before fixing, give me your diagnosis:
- What do you think is causing this?
- What files are involved?
- What's your proposed fix?
- Could the fix have side effects elsewhere?

Do not change any code yet.
```

### Performance Investigation

```
I suspect [area] has a performance problem.

Before making changes, give me an investigation plan:
- How would you measure the current performance baseline?
- What are the most likely causes given our stack?
- What changes would you propose and in what order?
- How do we verify the improvement?

Do not change any code yet.
```

---

## Checkpoints During Implementation

Use these prompts to stay in control during a long implementation session:

```
# After a phase completes:
"Summarize exactly what you changed in phase [N] and why each change was necessary."

# Before touching native code or config files:
"Stop before modifying app.json / android/ / ios/. Tell me what you're about to change
and why, then wait for my confirmation."

# If something feels off:
"Pause. Before continuing, explain your current approach and whether there's a simpler
alternative you considered and rejected."

# If the plan needs to change mid-implementation:
"The original plan no longer fits. Propose an updated plan for the remaining phases
before continuing."
```

---

## DO NOT

- Do not start implementing before a plan is reviewed.
- Do not approve all phases at once for complex features.
- Do not let Claude continue to the next phase after an error without explicit approval.
- Do not skip the validation step between phases.
- Do not ask Claude to "just fix it quickly" without a plan for anything touching navigation,
  auth, native modules, or shared state.