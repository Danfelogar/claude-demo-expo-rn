import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { CharacterList } from '.';

// --- Mocks ---
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Image: (props: Record<string, unknown>) => React.createElement(View, props),
  };
});

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({
    data,
  }: {
    data: Array<{ id: number; name: string }>;
  }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="flash-list">
        {(data || []).map((item: { id: number; name: string }) => (
          <Text key={item.id} testID={`char-${item.id}`}>
            {item.name}
          </Text>
        ))}
      </View>
    );
  },
}));

jest.mock('@/components/CharacterCard', () => ({
  CharacterCard: ({
    name,
    id,
  }: {
    name: string;
    id: number;
  }) => {
    const { Text } = require('react-native');
    return <Text testID={`char-${id}`}>{name}</Text>;
  },
}));

jest.mock('@/components/CharacterSkeleton', () => ({
  CharacterSkeleton: () => {
    const { Text } = require('react-native');
    return <Text testID="skeleton">Loading characters...</Text>;
  },
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((_props: unknown, colorName: string) => {
    const defaults: Record<string, string> = {
      background: '#FFFFFF',
      text: '#11181C',
      icon: '#687076',
    };
    return defaults[colorName] ?? '#687076';
  }),
}));

const mockSetSelectedStatus = jest.fn();
jest.mock('@/store/characterStore', () => ({
  useCharacterStore: jest.fn((selector: (state: unknown) => unknown) => {
    const state = {
      selectedStatus: 'all',
      setSelectedStatus: mockSetSelectedStatus,
    };
    return selector(state);
  }),
}));

const mockCharacters = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive' as const,
    species: 'Human',
    type: '',
    gender: 'Male' as const,
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [],
    url: '',
    created: '',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive' as const,
    species: 'Human',
    type: '',
    gender: 'Male' as const,
    origin: { name: 'unknown', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: [],
    url: '',
    created: '',
  },
];

jest.mock('@/hooks/useCharacters', () => ({
  useCharacters: jest.fn(),
}));

function setUseCharactersReturn(
  value: Parameters<typeof import('@/hooks/useCharacters').useCharacters>[0] extends [infer T]
    ? T
    : never
) {
  const hook = require('@/hooks/useCharacters').useCharacters as jest.Mock;
  hook.mockReturnValue(value);
}

// --- Tests ---
describe('CharacterList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (require('@/hooks/useCharacters').useCharacters as jest.Mock).mockReturnValue({
      data: {
        info: { count: 826, pages: 42, next: 'url', prev: null },
        results: mockCharacters,
      },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      isSuccess: true,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      isPlaceholderData: false,
      refetch: jest.fn(),
      fetchStatus: 'idle',
      dataUpdatedAt: 0,
      updatedAt: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      hasPreviousPage: false,
      isPaused: false,
      isStale: true,
      isInitialLoading: false,
      status: 'success',
    } as any);
  });

  describe('rendering', () => {
    it('renders characters when data is available', () => {
      render(<CharacterList />);
      expect(screen.getByText('Rick Sanchez')).toBeTruthy();
      expect(screen.getByText('Morty Smith')).toBeTruthy();
    });

    it('renders the skeleton while loading', () => {
      (require('@/hooks/useCharacters').useCharacters as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isFetching: false,
        isSuccess: false,
        isPending: true,
        isLoadingError: false,
        isRefetchError: false,
        isPlaceholderData: false,
        refetch: jest.fn(),
        fetchStatus: 'fetching',
        dataUpdatedAt: 0,
        updatedAt: 0,
        isFetched: false,
        isFetchedAfterMount: false,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        hasPreviousPage: false,
        isPaused: false,
        isStale: false,
        isInitialLoading: true,
        status: 'pending',
      } as any);
      render(<CharacterList />);
      expect(screen.getByText('Loading characters...')).toBeTruthy();
    });

    it('renders error state when fetch fails', () => {
      (require('@/hooks/useCharacters').useCharacters as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('API down'),
        isFetching: false,
        isSuccess: false,
        isPending: false,
        isLoadingError: true,
        isRefetchError: false,
        isPlaceholderData: false,
        refetch: jest.fn(),
        fetchStatus: 'idle',
        dataUpdatedAt: 0,
        updatedAt: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        hasPreviousPage: false,
        isPaused: false,
        isStale: false,
        isInitialLoading: false,
        status: 'error',
      } as any);
      render(<CharacterList />);
      expect(screen.getByText('Something went wrong')).toBeTruthy();
      expect(screen.getByText('API down')).toBeTruthy();
    });

    it('renders filter chips', () => {
      render(<CharacterList />);
      expect(screen.getByText('all')).toBeTruthy();
      expect(screen.getByText('Alive')).toBeTruthy();
      expect(screen.getByText('Dead')).toBeTruthy();
      expect(screen.getByText('unknown')).toBeTruthy();
    });
  });
});
