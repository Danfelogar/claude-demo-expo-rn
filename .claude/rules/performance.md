# Performance Rules
<!-- important if="working on lists, images, animations, heavy screens, or memory" -->

---

## Lists — FlashList over FlatList

Use **FlashList** (`@shopify/flash-list`) for any list with more than ~20 items.
`FlatList` is not banned for tiny static lists, but FlashList is always preferred.

```tsx
import { FlashList } from '@shopify/flash-list';

// ✅ Correct — always provide estimatedItemSize
<FlashList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  estimatedItemSize={80}          // measure one real item and use that value
  keyExtractor={(item) => item.id}
/>
```

Rules:
- **Always** set `estimatedItemSize` — without it FlashList falls back to slow measurement.
- Measure the actual rendered height of one item in dev; do not guess.
- For heterogeneous lists, provide `getItemType` so FlashList pools correctly.
- Avoid inline arrow functions in `renderItem` — extract to a named component or `useCallback`.

```tsx
// ❌ Bad — new function reference every render
renderItem={({ item }) => <Card item={item} />}

// ✅ Good
const renderItem = useCallback(({ item }: { item: Item }) => (
  <Card item={item} />
), []);
```

---

## Images — expo-image

Always use `expo-image`. Never use RN core `<Image>` or `<FastImage>`.

```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  style={{ width: 200, height: 200 }}
  placeholder={blurhash}          // show a blurhash while loading
  contentFit="cover"              // equivalent to resizeMode
  transition={200}                // fade-in in ms
  cachePolicy="memory-disk"       // default; explicit is clearer
/>
```

- Generate blurhash placeholders server-side and store alongside the URL.
- Use `cachePolicy="disk"` for assets that rarely change (avatars, product images).
- Never set `width`/`height` to `"100%"` inside a `ScrollView` without a fixed parent — measure with `onLayout` instead.

---

## Animations — Reanimated v4

Use **Reanimated v4** for all animations. Do not use the RN `Animated` API.

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

// Shared values live on the UI thread
const opacity = useSharedValue(0);
const scale = useSharedValue(1);

// Animated styles derived from shared values
const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
  transform: [{ scale: scale.value }],
}));

// Trigger on mount
useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
}, []);
```

Rules:
- All worklet functions must be marked `'worklet'` if called from the UI thread.
- Use `runOnJS` only to call JS functions (setState, callbacks) from a worklet.
- Prefer `withSpring` for interactive gestures (feels physical), `withTiming` for UI transitions.
- Use `useAnimatedRef` + `measure` for layout-relative animations instead of `onLayout`.
- For gesture-driven animations, always pair Reanimated with **Gesture Handler v2** — never use RN's `PanResponder`.

### Layout Animations

```tsx
import { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

<Animated.View entering={FadeIn.duration(250)} exiting={FadeOut} layout={Layout}>
  <Card />
</Animated.View>
```

- Use layout animations sparingly — they re-measure the entire subtree.
- Wrap lists of entering/exiting items with `Animated.View` and `layout={Layout}` to avoid jumps.

---

## Gestures — Gesture Handler v2

```tsx
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const tap = Gesture.Tap()
  .onEnd(() => {
    scale.value = withSpring(1);
  });

const longPress = Gesture.LongPress()
  .minDuration(500)
  .onStart(() => {
    scale.value = withSpring(0.95);
  });

// Compose gestures
const composed = Gesture.Exclusive(longPress, tap);

<GestureDetector gesture={composed}>
  <Animated.View style={animatedStyle}>...</Animated.View>
</GestureDetector>
```

- Prefer `GestureDetector` + `Gesture.*` (new API) over the old `PanGestureHandler` JSX API.
- The root `_layout.tsx` must be wrapped in `<GestureHandlerRootView style={{ flex: 1 }}>`.

---

## Memoization

Apply selectively — premature memoization adds overhead without benefit.

```tsx
// ✅ Memoize expensive child components
const ItemCard = React.memo(({ item }: { item: Item }) => { ... });

// ✅ Memoize callbacks passed to list items
const handlePress = useCallback((id: string) => { ... }, []);

// ✅ Memoize expensive derived data
const sorted = useMemo(() => [...items].sort(...), [items]);

// ❌ Do NOT memoize trivially cheap components
const Title = React.memo(({ text }: { text: string }) => <Text>{text}</Text>);
```

---

## Avoiding JS Thread Jank

- Keep `renderItem` fast — no heavy computation, no synchronous storage reads.
- Paginate data: load 20–50 items, use `onEndReached` to fetch more.
- Batch state updates — React 19 auto-batches, but avoid calling `setState` in a loop.
- Heavy computations (sorting, filtering large arrays) belong in `useMemo` or a worker.
- Use `InteractionManager.runAfterInteractions` for non-critical work after a transition:

```tsx
import { InteractionManager } from 'react-native';

useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    // Safe to do heavy work here
    loadAnalytics();
  });
  return () => task.cancel();
}, []);
```

---

## Hermes & New Architecture

This project runs on **New Architecture** (enabled in `app.json`).
- The Fabric renderer and JSI bridge are active — avoid legacy NativeModules where possible.
- All installed native modules must support New Architecture. Check before installing.
- Reanimated v4 and Gesture Handler v2 are already compatible.

---

## DO NOT

- Do not use `FlatList` for long lists.
- Do not use `react-native`'s `Animated` API — use Reanimated.
- Do not use `PanResponder` — use Gesture Handler.
- Do not use RN core `<Image>`.
- Do not perform heavy computation inside `renderItem`.
- Do not wrap every component in `React.memo` by default.
- Do not install native modules without verifying New Architecture support.