# Navigation Rules
<!-- important if="working on screens, routing, deep links, tabs, or stacks" -->

Stack: **Expo Router v6** (file-based) on top of **React Navigation v7**.

---

## File-Based Routing Structure

```
app/
  _layout.tsx           # Root layout — wrap with providers here
  (tabs)/
    _layout.tsx         # Tab navigator config
    index.tsx           # Home tab  →  path: /
    explore.tsx         # Explore tab  →  path: /explore
  (auth)/
    _layout.tsx         # Auth group — no tab bar
    login.tsx           # path: /login
    register.tsx        # path: /register
  modal.tsx             # path: /modal  (presented as modal)
  [id].tsx              # Dynamic segment  →  path: /:id
  +not-found.tsx        # 404 fallback
```

- Group folders `(name)` affect layout but **not** the URL path.
- Prefix with `_` to exclude a file from routing (e.g. `_components/`).
- Always add `+not-found.tsx` at the root to handle unknown routes gracefully.

---

## Navigation Primitives

```tsx
// ✅ Preferred — type-safe, works with Expo Router
import { router, useLocalSearchParams, Link } from 'expo-router';

// Navigate
router.push('/profile');
router.replace('/login');   // no back gesture
router.back();

// Typed params
const { id } = useLocalSearchParams<{ id: string }>();

// Declarative link
<Link href="/explore">Go to Explore</Link>
```

```tsx
// ❌ Avoid — useNavigation() from React Navigation directly
// Only drop down to it when Expo Router's API is insufficient
```

---

## Tab Navigator

Configure tabs in `app/(tabs)/_layout.tsx` using `<Tabs>` from `expo-router`:

```tsx
import { Tabs } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TabLayout() {
  const tint = useThemeColor({}, 'tint');
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: tint }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name="house" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

- Keep tab count to **5 or fewer** — more than that hurts UX on small screens.
- Tab icons must use `expo-symbols` (`IconSymbol`) for consistency with platform conventions.

---

## Stack Navigator

Use `<Stack>` in a group `_layout.tsx`:

```tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: 'modal', title: 'Details' }}
      />
    </Stack>
  );
}
```

- Use `presentation: 'modal'` for sheets/dialogs, not for primary navigation.
- Prefer `presentation: 'transparentModal'` for custom overlays over a native modal.

---

## Deep Links & Universal Links

Configured in `app.json` under `expo.scheme` (for deep links) and `expo.web.bundler`.

```json
// app.json
{
  "expo": {
    "scheme": "myapp",
    "web": { "bundler": "metro" }
  }
}
```

Test deep links locally:
```bash
npx uri-scheme open myapp://explore --ios
npx uri-scheme open myapp://explore --android
```

Always add a `+not-found.tsx` fallback so broken deep links land gracefully.

---

## Typed Routes (Expo Router v3+)

Enable in `app.json`:
```json
{ "expo": { "experiments": { "typedRoutes": true } } }
```

This generates types for `href` props and `router.push()` — use them.

---

## Auth Flow Pattern

Use a group with its own layout to isolate auth screens:

```
app/
  (auth)/
    _layout.tsx    # <Stack> with no tab bar
    login.tsx
  (app)/
    _layout.tsx    # Tab layout, protected
    index.tsx
```

Redirect unauthenticated users at the layout level with `<Redirect href="/login" />` from `expo-router`, not in individual screens.

---

## DO NOT

- Do not use `react-navigation` `NavigationContainer` — Expo Router wraps it already.
- Do not call `useNavigation()` unless Expo Router's API cannot cover the use case.
- Do not store navigation state manually in Zustand/context — the router owns it.
- Do not hardcode path strings in multiple places — centralise in a `constants/routes.ts` if reused.
- Do not nest navigators deeper than 3 levels — restructure the file tree instead.