# Command: /new-hook

Create a new custom hook following project conventions.

## Before writing any code, ask me:

1. **Hook name** — camelCase starting with `use` (e.g. `useProductList`, `useAuthSession`, `useDebounce`)
2. **What it does** — data fetching, local state, side effects, or derived computation?
3. **Does it need TanStack Query?** — is it fetching/mutating remote data?
4. **Return shape** — what should callers get back?

---

## What to generate

### File location

```
hooks/use<HookName>.ts        ← always here, no exceptions
```

If the hook is tightly coupled to a single component, co-locate it:
```
components/<ComponentName>/
  index.tsx
  use<ComponentName>.ts      ← co-located hook
```

---

### Template A — Local state / utility hook

```ts
// hooks/use<HookName>.ts
import { useState, useCallback } from 'react';

interface Use<HookName>Options {
  // input params if any
}

interface Use<HookName>Return {
  // explicitly type every returned value
}

export function use<HookName>(options?: Use<HookName>Options): Use<HookName>Return {
  const [state, setState] = useState<Type>(initialValue);

  const doSomething = useCallback(() => {
    // logic
  }, [/* deps */]);

  return { state, doSomething };
}
```

### Template B — Data fetching hook (TanStack Query)

> Add TanStack Query first: `npx expo install @tanstack/react-query`

```ts
// hooks/use<HookName>.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query keys as constants — never inline strings
export const <HOOK_NAME>_KEYS = {
  all: ['<entity>'] as const,
  detail: (id: string) => ['<entity>', id] as const,
};

export function use<HookName>(id: string) {
  return useQuery({
    queryKey: <HOOK_NAME>_KEYS.detail(id),
    queryFn: () => fetch<Entity>(id),
    staleTime: 5 * 60 * 1000, // 5 min — adjust per use case
  });
}

export function useUpdate<HookName>() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePayload) => update<Entity>(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: <HOOK_NAME>_KEYS.all });
    },
  });
}
```

Query key rules:
- Always define keys as constants in the same file as the hook.
- Use arrays: `['entity', id]` — never plain strings.
- Invalidate by the broadest key needed, not the most specific.

### Template C — Side effect hook (subscriptions, device APIs)

```ts
// hooks/use<HookName>.ts
import { useEffect, useRef } from 'react';

export function use<HookName>() {
  const subscription = useRef<ReturnType<typeof subscribe> | null>(null);

  useEffect(() => {
    subscription.current = subscribe(handler);
    return () => {
      subscription.current?.remove();
    };
  }, []); // document why deps array is empty if it is
}
```

---

## Hook rules

- **One responsibility per hook** — if a hook does two unrelated things, split it.
- **Always type the return value** with an explicit `interface` or inline object type.
- **No `any`** — use `unknown` and narrow, or type the API response properly.
- **Memoize callbacks** with `useCallback`; memoize derived data with `useMemo` when the computation is genuinely expensive.
- **Do not call hooks conditionally** — never inside `if`, `for`, or nested functions.
- If the hook reads from storage or a device API, handle loading + error states explicitly.

---

### Hook test — `hooks/use<HookName>.test.ts`

```ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { use<HookName> } from './use<HookName>';

describe('use<HookName>', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => use<HookName>());
    expect(result.current.<value>).toBe(<expected>);
  });

  it('<describes a behavior>', async () => {
    const { result } = renderHook(() => use<HookName>());
    act(() => result.current.<action>());
    await waitFor(() => expect(result.current.<value>).toBe(<expected>));
  });
});
```

For TanStack Query hooks, wrap in a `QueryClientProvider` in the test:
```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const { result } = renderHook(() => use<HookName>(), { wrapper: createWrapper() });
```

---

## Checklist before finishing

- [ ] File at `hooks/use<HookName>.ts`
- [ ] Return type explicitly typed with `interface`
- [ ] No `any`
- [ ] Correct template used (local state / TanStack Query / side effect)
- [ ] Query keys defined as constants (if TanStack Query)
- [ ] Cleanup returned from `useEffect` if it sets up a subscription
- [ ] Test file created