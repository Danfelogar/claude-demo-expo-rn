import { render, screen } from '@testing-library/react-native';
import * as React from 'react';

import { HomeFeed } from '.';
import { FeedCategory } from '@/types/feed';
import type { FeedItem } from '@/types/feed';

// --- Mocks ---
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({ data }: { data: FeedItem[] }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="flash-list">
        {(data || []).map((item: FeedItem) => (
          <Text key={item.id} testID={`feed-item-${item.id}`}>
            {item.title}
          </Text>
        ))}
      </View>
    );
  },
}));

jest.mock('@/components/FeedItemCard', () => ({
  FeedItemCard: ({ item }: { item: FeedItem }) => {
    const { Text } = require('react-native');
    return <Text>{item.title}</Text>;
  },
}));

jest.mock('@/components/FeedSkeleton', () => ({
  FeedSkeleton: () => {
    const { Text } = require('react-native');
    return <Text testID="skeleton">Loading feed...</Text>;
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

// --- Test data ---
const mockFeedData: FeedItem[] = [
  {
    id: '1',
    title: 'React 19 Server Components',
    description: 'React 19 description',
    category: FeedCategory.Technology,
    imageUrl: 'https://example.com/img.jpg',
    timestamp: new Date('2026-04-05T10:30:00Z'),
  },
  {
    id: '2',
    title: 'Design Systems 2026',
    description: 'Design systems description',
    category: FeedCategory.Design,
    imageUrl: 'https://example.com/img2.jpg',
    timestamp: new Date('2026-04-04T18:15:00Z'),
  },
];

jest.mock('@/hooks/useFeed', () => ({
  useFeed: jest.fn(),
}));

function setUseFeedReturn(value: {
  data: FeedItem[];
  isLoading: boolean;
  error: string | null;
}) {
  const useFeed = require('@/hooks/useFeed').useFeed as jest.Mock;
  useFeed.mockReturnValue(value);
}

// --- Tests ---
describe('HomeFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUseFeedReturn({ data: mockFeedData, isLoading: false, error: null });
  });

  describe('rendering', () => {
    it('renders the feed list when data is available', () => {
      render(<HomeFeed />);
      expect(screen.getByText('React 19 Server Components')).toBeTruthy();
      expect(screen.getByText('Design Systems 2026')).toBeTruthy();
    });

    it('renders the skeleton while loading', () => {
      setUseFeedReturn({ data: [], isLoading: true, error: null });
      render(<HomeFeed />);
      expect(screen.getByText('Loading feed...')).toBeTruthy();
    });

    it('renders error state when feed fails', () => {
      setUseFeedReturn({ data: [], isLoading: false, error: 'Failed to load feed' });
      render(<HomeFeed />);
      expect(screen.getByText('Something went wrong')).toBeTruthy();
      expect(screen.getByText('Failed to load feed')).toBeTruthy();
    });

    it('renders empty state when data is []', () => {
      setUseFeedReturn({ data: [], isLoading: false, error: null });
      render(<HomeFeed />);
      expect(screen.getByText('No items yet')).toBeTruthy();
      expect(
        screen.getByText('Check back later for new content.')
      ).toBeTruthy();
    });
  });
});
