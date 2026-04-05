# Command: /new-component

Create a new reusable UI component following project conventions.

## Before writing any code, ask me:

1. **Component name** — PascalCase (e.g. `AvatarCard`, `PriceTag`, `EmptyState`)
2. **Category** — `ui` (pure primitive, no logic) or `components` root (can use hooks/state)?
3. **What it displays or does** — brief description of its responsibility
4. **Does it need platform-specific variants?** — iOS/Android/Web behave differently?

---

## What to generate

### File location

| Category | Path |
|---|---|
| Primitive (no logic, no data) | `components/ui/<ComponentName>/index.tsx` |
| Smart (hooks, state, navigation) | `components/<ComponentName>/index.tsx` |
| Platform variant needed | `components/ui/<ComponentName>/index.tsx` + `index.ios.tsx` |

### 2. Component file

```tsx
import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface <ComponentName>Props {
  // all props typed here — no `any`
  // extend PressableProps if the component is tappable:
  // extends PressableProps { ... }
}

export function <ComponentName>({ ...props }: <ComponentName>Props) {
  const border = useThemeColor({}, 'border'); // example — only what's needed

  return (
    <ThemedView style={styles.container}>
      <ThemedText>{/* content */}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
```

Rules:
- **Named export** — not default export (components are imported by name, not by route).
- Use `interface` for props, never `type` alias.
- Extend the relevant RN base interface for wrapper components:
  - Tappable → `extends PressableProps`
  - Container → `extends ViewProps`
  - Text variant → `extends TextProps`
- Use `Pressable` for any tappable area — never `TouchableOpacity`.
- Use `useThemeColor` for colors — never hardcode hex values.
- Use `StyleSheet.create` — no inline style objects for static styles.
- `ui/` components must be purely presentational: no data fetching, no `router.push`, no global state.

### 3. Platform variant (only if needed)

If iOS needs SF Symbols and Android/web needs a fallback:
```
components/ui/<ComponentName>/
  index.tsx        ← Android + web fallback
  index.ios.tsx    ← iOS-specific implementation
```

Both files must export the same `interface` and the same component name.

### 4. Haptics (if the component is interactive)

```tsx
import * as Haptics from 'expo-haptics';

// Inside the onPress handler:
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

Only add haptics to discrete, intentional interactions — not hover states or scroll events.

### 5. Animated variant (if the component has press feedback)

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

<Pressable
  onPressIn={() => { scale.value = withSpring(0.96); }}
  onPressOut={() => { scale.value = withSpring(1); }}
>
  <Animated.View style={[styles.container, animatedStyle]}>
    {/* content */}
  </Animated.View>
</Pressable>
```

Use `withSpring` for press interactions (feels physical). Use `withTiming` for state transitions.

### 6. Component test — `components/<path>/<ComponentName>/index.test.tsx`

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { <ComponentName> } from './index';

describe('<ComponentName>', () => {
  it('renders without crashing', () => {
    render(<<ComponentName> {/* required props */} />);
    // assert visible text or role
  });

  // If interactive:
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<<ComponentName> onPress={onPress} {/* other required props */} />);
    fireEvent.press(screen.getBy...(...));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

---

## Checklist before finishing

- [ ] Component file created in the correct folder (`ui/` vs root `components/`)
- [ ] Named export (not default)
- [ ] Props typed with `interface` — no `any`
- [ ] Base RN interface extended if wrapping a native primitive
- [ ] `Pressable` used (not `TouchableOpacity`) for any tappable area
- [ ] No hardcoded colors — `useThemeColor` used
- [ ] `StyleSheet.create` for all static styles
- [ ] Haptics added if interactive
- [ ] Platform variants created if behavior differs per platform
- [ ] Test file created