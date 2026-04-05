# Command: /new-screen

Create a new screen in the Expo Router app following project conventions.

## Before writing any code, ask me:

1. **Screen name** — PascalCase (e.g. `UserProfile`, `OrderDetails`, `Settings`)
2. **Route path** — where does it live? (e.g. `(tabs)/profile`, `(auth)/register`, `product/[id]`)
3. **Data it needs to display** — props, route params, or fetched data?
4. **Navigation entry point** — what screen or action navigates here?

---

## What to generate

### 1. Screen file — `app/<route-path>.tsx`

```tsx
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
// If it receives route params:
import { useLocalSearchParams } from 'expo-router';

interface <ScreenName>Params {
  // typed params from the route
}

export default function <ScreenName>Screen() {
  const background = useThemeColor({}, 'background');
  // const { id } = useLocalSearchParams<<ScreenName>Params>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title"><ScreenName></ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

Rules:
- Default export only — Expo Router requires it.
- Use `ThemedView` + `ThemedText` as the outermost containers.
- Use `useThemeColor` for any color not covered by themed primitives — never hardcode hex values.
- Use `useLocalSearchParams` for dynamic route params, not `useNavigation().getParam`.
- Use `StyleSheet.create` — no inline style objects for static styles.
- No business logic in the screen file — extract to a custom hook `hooks/use<ScreenName>.ts` if needed.

### 2. Route registration

If the screen is a **tab**, add a `<Tabs.Screen>` entry in `app/(tabs)/_layout.tsx`:
```tsx
<Tabs.Screen
  name="<filename>"
  options={{
    title: '<Human readable title>',
    tabBarIcon: ({ color }) => <IconSymbol name="<sf-symbol-name>" color={color} />,
  }}
/>
```

If the screen is a **stack screen**, confirm it's covered by the nearest `_layout.tsx` `<Stack>`.
If no layout covers it, create or update the appropriate `_layout.tsx`.

### 3. Basic smoke test — `app/<route-path>.test.tsx`

```tsx
import { render, screen } from '@testing-library/react-native';
import <ScreenName>Screen from './<filename>';

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  router: { push: jest.fn(), back: jest.fn() },
}));

describe('<ScreenName>Screen', () => {
  it('renders without crashing', () => {
    render(<<ScreenName>Screen />);
    expect(screen.getByText('<ScreenName>')).toBeTruthy();
  });
});
```

### 4. If the screen fetches data — `hooks/use<ScreenName>.ts`

Extract all data-fetching and derived state into a dedicated hook:
```ts
// hooks/use<ScreenName>.ts
export function use<ScreenName>(<params>) {
  // TanStack Query, local state, or derived logic here
  return { data, isLoading, error };
}
```

The screen component stays as a pure render layer.

---

## Checklist before finishing

- [ ] Screen file created with correct default export
- [ ] Route params typed with an interface (if any)
- [ ] No hardcoded colors — `useThemeColor` used throughout
- [ ] `StyleSheet.create` used for all styles
- [ ] Navigation entry point updated (tab layout or stack layout)
- [ ] Smoke test created
- [ ] Data-fetching hook created separately (if screen loads data)
- [ ] No `any` types