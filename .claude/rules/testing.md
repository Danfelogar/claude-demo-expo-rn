# Testing Rules
<!-- important if="working on tests, mocks, coverage, or CI" -->

> ⚠️ No test runner is configured in this project yet.
> This file defines the conventions to follow **when testing is set up**.
> Recommended stack: **Jest + React Native Testing Library (RNTL)**.

---

## Recommended Setup

```bash
npm install --save-dev jest jest-expo @testing-library/react-native @testing-library/jest-native
```

`package.json` additions:
```json
{
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterFramework": ["@testing-library/jest-native/extend-expect"],
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@shopify/flash-list|expo-router)"
    ]
  }
}
```

---

## File Conventions

- Test files live **next to the component/hook** they test:
  ```
  components/Button/
    index.tsx
    index.test.tsx     ✅
  hooks/
    useAuth.ts
    useAuth.test.ts    ✅
  ```
- Name: `*.test.tsx` for components, `*.test.ts` for hooks and utilities.
- No `__tests__/` folder — co-location makes tests easier to find and maintain.

---

## Component Tests (RNTL)

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from './index';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Save" onPress={() => {}} />);
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Button label="Save" onPress={onPress} />);
    fireEvent.press(screen.getByText('Save'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button label="Save" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Save'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

Rules:
- Query by **accessible text or role** first (`getByText`, `getByRole`) — not by `testID`.
- Use `testID` only when no semantic query works.
- Do not test implementation details (internal state, style values).
- Test **behavior**: what the user sees and does, not how the component works internally.

---

## Hook Tests

```tsx
import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from './useCounter';

it('increments the count', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

---

## Mocking

### expo modules

```ts
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
}));
```

### expo-router

```ts
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));
```

### Async storage / network

Use **msw** (Mock Service Worker) for network mocks when TanStack Query is added:

```ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/users', () => HttpResponse.json([{ id: '1', name: 'Ana' }]))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## What to Test

| Priority | What |
|---|---|
| ✅ High | User-facing behavior (renders, interactions, error states) |
| ✅ High | Custom hooks with logic (auth, form state, data transforms) |
| ✅ High | Utility functions (pure functions, formatters, validators) |
| 🟡 Medium | Navigation flows (screen transitions, param passing) |
| 🟡 Medium | Integration: component + hook together |
| ❌ Low | Snapshot tests — brittle, low signal |
| ❌ Skip | Third-party library internals |
| ❌ Skip | Style values / exact pixel dimensions |

---

## Coverage

When coverage is enabled in CI:
- **70% minimum** for `hooks/` and `utils/`.
- **50% minimum** for `components/`.
- Do not chase 100% — test meaningful paths, not every line.

```bash
npx jest --coverage --coverageDirectory=coverage
```

---

## DO NOT

- Do not use Enzyme — it does not support React 19 / New Architecture.
- Do not snapshot test complex components — they break on any UI change.
- Do not mock modules you own — test the real thing.
- Do not test implementation details (internal `useState`, style objects).
- Do not put tests in a separate `__tests__/` root folder.