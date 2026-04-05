import { render, screen, fireEvent } from '@testing-library/react-native';
import * as React from 'react';

import { FeedItemCard } from '.';
import type { FeedItem } from '@/types/feed';
import { FeedCategory } from '@/types/feed';

// --- Mocks ---
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
}));

jest.mock('expo-image', () => ({
  Image: ({ testID }: { testID?: string }) =>
    require('react-native').View({ testID }),
}));

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

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

// --- Helpers ---
const mockFeedItem: FeedItem = {
  id: '1',
  title: 'React 19 Server Components Go Stable',
  description:
    'The React team announces stable support for Server Components and Actions.',
  category: FeedCategory.Technology,
  imageUrl: 'https://example.com/image.jpg',
  timestamp: new Date('2026-04-05T10:30:00Z'),
};

const defaultProps = {
  item: mockFeedItem,
};

const renderComponent = (overrides: { item: FeedItem } = defaultProps) =>
  render(<FeedItemCard {...overrides} />);

// --- Tests ---
describe('FeedItemCard', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('rendering', () => {
    it('renders the feed item title', () => {
      renderComponent();
      expect(screen.getByText(/React 19 Server Components/i)).toBeTruthy();
    });

    it('renders the feed item description', () => {
      renderComponent();
      expect(
        screen.getByText(/The React team announces stable support/i)
      ).toBeTruthy();
    });

    it('renders the category badge', () => {
      renderComponent();
      expect(screen.getByText('Technology')).toBeTruthy();
    });

    it('renders the timestamp', () => {
      // The timestamp is relative — "Xm ago" or "Xh ago" or a date
      renderComponent();
      // Since the timestamp could be in the future or past depending on when this runs,
      // we just verify the timestamp text element exists (it always renders something)
      const timeElements = screen.UNSAFE_getAllByType('Text').filter((el) => {
        const text = (el.props.children as string) || '';
        return text.includes(' ago') || !isNaN(Date.parse(text));
      });
      expect(timeElements.length).toBeGreaterThan(0);
    });

    it('has proper accessibility props', () => {
      renderComponent();
      const card = screen.getByRole('button');
      expect(card).toBeTruthy();
      expect(
        card.props.accessibilityLabel
      ).toContain(mockFeedItem.title);
      expect(
        card.props.accessibilityLabel
      ).toContain(mockFeedItem.category);
    });
  });

  describe('interactions', () => {
    it('is pressable with accessibility role button', () => {
      renderComponent();
      const button = screen.getByRole('button');
      expect(button).toBeTruthy();
    });
  });
});
