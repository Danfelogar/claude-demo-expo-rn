# Components Rules
<!-- important if="working on UI components, design system, layout, forms, or styling" -->
---

## File Structure

Each component lives in its own folder:

```
components/
  Button/
    index.tsx           # Main export
    button.styles.ts    # StyleSheet (if styles are large)
    button.test.tsx     # Tests alongside the component
  Card/
    index.tsx
  ui/                   # Low-level primitives (no business logic)
    Divider/
    Spacer/
    Badge/
```

- `components/ui/` — purely presentational, no data fetching, no navigation.
- `components/` root — can contain smart components that use hooks.
- Co-locate styles with the component; do not create a global `styles/` folder.

---

## Typing Props

Always use `interface` for props, never `type` alias:

```tsx
// ✅ Correct
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

// ❌ Wrong
type ButtonProps = { label: string; onPress: () => void };
```

- Export the props interface when the component is part of the design system.
- Extend `ViewProps` / `TextProps` / `PressableProps` for wrapper components so native props pass through:

```tsx
import { Pressable, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary';
}
```

---

## Pressable over TouchableOpacity

```tsx
// ✅ Use Pressable
<Pressable
  onPress={handlePress}
  style={({ pressed }) => [styles.button, pressed && styles.pressed]}
>
  <Text style={styles.label}>{label}</Text>
</Pressable>

// ❌ Never use TouchableOpacity
<TouchableOpacity onPress={handlePress}>...</TouchableOpacity>
```

For animated press feedback with Reanimated:
```tsx
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

<Pressable
  onPressIn={() => { scale.value = withSpring(0.96); }}
  onPressOut={() => { scale.value = withSpring(1); }}
>
  <Animated.View style={[styles.card, animatedStyle]}>...</Animated.View>
</Pressable>
```

---

## Theming

Use the project's theme hooks — never hardcode colors:

```tsx
import { useThemeColor } from '@/hooks/use-theme-color';

// Single color
const background = useThemeColor({}, 'background');

// Override per theme
const border = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'border');
```

Use `ThemedView` and `ThemedText` for basic containers and text:

```tsx
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

<ThemedView style={styles.container}>
  <ThemedText type="title">Hello</ThemedText>
</ThemedView>
```

---

## Styling

Use `StyleSheet.create` for all styles. Avoid inline style objects (they create new references on every render):

```tsx
// ✅ Correct
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600' },
});

// ❌ Avoid — new object every render
<View style={{ flex: 1, padding: 16 }}>
```

Dynamic styles:
```tsx
// ✅ Merge static + dynamic
<View style={[styles.base, isActive && styles.active, { opacity }]} />
```

---

## Platform-Specific Components

Use file suffixes for platform variants:

```
components/ui/
  IconSymbol/
    index.tsx           # fallback / web
    index.ios.tsx       # iOS-specific (SF Symbols)
```

Inside a component, use `Platform.select` for minor differences:

```tsx
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: { elevation: 4 },
    default: {},
  }),
});
```

---

## Haptics

Add haptic feedback on meaningful interactions using `expo-haptics`:

```tsx
import * as Haptics from 'expo-haptics';

// Light tap for list items, buttons
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium for toggles, selections
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Notification for success/error states
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

Do **not** add haptics to every single press — only intentional, discrete actions.

---

## Forms (when React Hook Form + Zod are added)

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { onChange, value } }) => (
        <TextInput onChangeText={onChange} value={value} />
      )}
    />
  );
}
```

- Never use `<form>` (HTML); use `Pressable` or a custom submit button.
- Always pair React Hook Form with **Zod** for runtime validation.
- One schema per form; export it for reuse in API layer validation.

---

## Accessibility

- Every interactive element needs `accessibilityLabel` if the label is not obvious from children.
- Decorative images: `accessible={false}`.
- Use `accessibilityRole` on custom buttons: `accessibilityRole="button"`.
- Minimum touch target: **44×44 pt** (Apple HIG) — use `minWidth`/`minHeight` in styles.

---

## DO NOT

- Do not hardcode colors — use `useThemeColor`.
- Do not use `TouchableOpacity`.
- Do not use inline style objects for static styles.
- Do not put business logic or data fetching inside UI components.
- Do not use `type` alias for component props — use `interface`.
- Do not use `any`.