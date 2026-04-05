# Command: /fix-bug

Diagnose and fix a bug without touching unrelated code.

## Before writing any code, ask me:

1. **What is the bug?** — describe the wrong behavior
2. **How to reproduce it** — steps or a minimal code snippet
3. **Expected vs actual behavior** — be explicit
4. **Where do you think it lives?** — file, component, or hook (optional)

---

## Protocol

### Step 1 — Diagnose first, fix second

Before proposing any change, output a diagnosis block:

```
## Diagnosis

**Root cause**: [one sentence]
**Files involved**: [list]
**Why it happens**: [explanation]
**Confidence**: high / medium / low

**Considered and ruled out**:
- [alternative cause A] — ruled out because [reason]
- [alternative cause B] — ruled out because [reason]
```

Wait for confirmation before proceeding to the fix.

### Step 2 — Propose the fix

```
## Proposed Fix

**Change in `<file>`**: [describe the change in plain English]

**Why this fixes it**: [explain the causality]

**Possible side effects**: [list anything that could break]

**Tests to add or update**: [list]
```

Wait for approval.

### Step 3 — Implement

Make the minimal change that fixes the bug. Do not:
- Refactor unrelated code in the same diff
- Add features while fixing the bug
- Change formatting of lines not involved in the fix

### Step 4 — Verify

After the fix, output:
```
## Verification

- [ ] The reproduction steps no longer trigger the bug
- [ ] Existing tests still pass (run: npm run lint)
- [ ] New test added that would have caught this bug
- [ ] No unrelated files were modified
```

---

## Common RN / Expo bug patterns

**Stale closure in useEffect**
- Symptom: effect uses an old value of a prop or state variable
- Fix: add the variable to the deps array, or use `useRef` if you only need the latest value without re-running the effect

**Missing `key` prop causing wrong re-renders**
- Symptom: list items show wrong data after update
- Fix: ensure `keyExtractor` returns a stable, unique ID — never use array index

**Navigation params not typed**
- Symptom: `useLocalSearchParams` returns `string | string[]` unexpectedly
- Fix: add generic `useLocalSearchParams<{ id: string }>()` and handle the string array case

**Reanimated worklet calling a non-worklet function**
- Symptom: crash "Tried to synchronously call a non-worklet function"
- Fix: wrap the JS callback with `runOnJS`

**expo-image not showing on web**
- Symptom: image renders on native but blank on web
- Fix: ensure `contentFit` is set and the source URI is absolute (not relative)

**`StyleSheet.create` called outside component with `useColorScheme` dependency**
- Symptom: styles don't update on theme change
- Fix: move dynamic color values into the component body using `useThemeColor`, keep `StyleSheet.create` for static structure only

---

## DO NOT

- Do not fix multiple unrelated bugs in the same session.
- Do not refactor while fixing — create a separate task for that.
- Do not change files that are not causally related to the bug.
- Do not skip the diagnosis step even if the fix seems obvious.