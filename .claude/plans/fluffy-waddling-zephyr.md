# Plan: Rick & Morty Characters Screen with Animated List

## Context

The user wants a new screen that displays Rick & Morty characters from the API in an animated scrollable list. This adds real API integration (Zustand + TanStack Query + Axios) to a project currently using only mock data. All new code must include unit tests and strict TypeScript typing.

**API**: `GET https://rickandmortyapi.com/api/character` — returns paginated `{ info, results: Character[] }` (20 chars/page, 826 total).

---

## Phase 1: Install Dependencies

```bash
npx expo install zustand @tanstack/react-query axios
```

- `zustand` — global store for UI state (favorites, filters)
- `@tanstack/react-query` — server state caching/fetching
- `axios` — HTTP client

---

## Phase 2: Types & API Layer

### `types/character.ts` — Strict API types
```ts
export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterPage {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}
```

### `services/api.ts` — Axios instance
- Base URL: `https://rickandmortyapi.com/api`
- Create `axiosInstance` with typed response

### `services/characters.ts` — Fetch function
- `fetchCharacters(page: number): Promise<CharacterPage>`
- Uses axios instance

**Test**: `services/__tests__/characters.test.ts` — mock axios, verify fetch + error handling

---

## Phase 3: Zustand Store

### `store/characterStore.ts`
```ts
interface CharacterState {
  favorites: number[];           // character IDs
  selectedStatus: 'all' | 'Alive' | 'Dead' | 'unknown';
  toggleFavorite: (id: number) => void;
  setSelectedStatus: (status: CharacterState['selectedStatus']) => void;
}
```

- Simple global UI state — favorites + filter
- No persistence needed (session-only)

**Test**: `store/__tests__/characterStore.test.ts` — test toggle/filter actions

---

## Phase 4: TanStack Query Hook

### `hooks/useCharacters.ts`
```ts
export function useCharacters(page: number) {
  return useQuery<CharacterPage, Error>({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
    staleTime: 5 * 60 * 1000,
  });
}
```

**Test**: `hooks/__tests__/useCharacters.test.ts` — test with mocked fetch

---

## Phase 5: Components

### `components/CharacterCard/index.tsx`
- `Image` from `expo-image` for character avatar
- Name, species, status badge (colored by status: green=Alive, red=Dead, gray=unknown)
- Origin location
- Heart icon for favorites (via Zustand store)
- `Pressable` for interaction
- `Animated.View` with `FadeInDown` entry animation (GPU-only: transform + opacity)
- `memo()` with primitive props only (list-performance-item-memo)

### `components/CharacterCard/index.test.tsx`
- Render tests (name, species, status badge, image)
- Press interaction tests
- Follow existing test patterns (mock expo-image, reanimated, useThemeColor)

### `components/CharacterSkeleton/index.tsx`
- Skeleton loading placeholder with shimmer animation
- Reuse existing `FeedSkeleton` shimmer pattern

### `components/CharacterList/index.tsx`
- `FlashList` with `estimatedItemSize` (list-performance-virtualize)
- Pagination: load more on end reached
- Loading/error/empty states
- Status filter chips (All, Alive, Dead, Unknown) — uses Zustand store
- `useCallback` for renderItem/keyExtractor

### `components/CharacterList/index.test.tsx`
- Render states (loading, error, empty, data)
- List renders items
- Follow existing HomeFeed test pattern

---

## Phase 6: Screen & Navigation

### `app/(tabs)/characters.tsx`
- New tab screen wrapping `CharacterList`

### `app/(tabs)/_layout.tsx`
- Add third tab "Characters" with icon

---

## Phase 7: QueryProvider

### `app/_layout.tsx`
- Wrap app in `QueryClientProvider` from TanStack Query
- Create `QueryClient` at module level

---

## File Summary

| Action | File |
|--------|------|
| Create | `types/character.ts` |
| Create | `services/api.ts` |
| Create | `services/characters.ts` |
| Create | `services/__tests__/characters.test.ts` |
| Create | `store/characterStore.ts` |
| Create | `store/__tests__/characterStore.test.ts` |
| Create | `hooks/useCharacters.ts` |
| Create | `hooks/__tests__/useCharacters.test.ts` |
| Create | `components/CharacterCard/index.tsx` |
| Create | `components/CharacterCard/index.test.tsx` |
| Create | `components/CharacterSkeleton/index.tsx` |
| Create | `components/CharacterList/index.tsx` |
| Create | `components/CharacterList/index.test.tsx` |
| Create | `app/(tabs)/characters.tsx` |
| Modify | `app/(tabs)/_layout.tsx` |
| Modify | `app/_layout.tsx` |

---

## Reusable Existing Code

- `useThemeColor` hook — `hooks/use-theme-color.ts`
- `ThemedText` component — `components/themed-text.tsx`
- `ThemedView` component — `components/themed-view.tsx`
- `HapticTab` component — `components/haptic-tab.tsx`
- `IconSymbol` — `components/ui/icon-symbol.tsx`
- `Colors` — `constants/theme.ts`
- `FlashList` from `@shopify/flash-list` (already installed)
- `react-native-reanimated` (already installed)
- `expo-image` (already installed)

---

## Verification

1. **Lint**: `npm run lint`
2. **Tests**: `npx jest --coverage` — all new tests pass
3. **Runtime**: `npm start` → Characters tab shows Rick & Morty characters with scroll animations
4. **Type check**: `npx tsc --noEmit`
