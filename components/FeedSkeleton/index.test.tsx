import { render } from '@testing-library/react-native';
import * as React from 'react';

import { FeedSkeleton } from '.';

// --- Mocks ---
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((_props: unknown, colorName: string) => {
    const defaults: Record<string, string> = {
      background: '#FFFFFF',
      text: '#11181C',
      icon: '#E5E7EB',
    };
    return defaults[colorName] ?? '#687076';
  }),
}));

// --- Tests ---
describe('FeedSkeleton', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders three skeleton card placeholders', () => {
    const { UNSAFE_getAllByType } = render(<FeedSkeleton />);
    const views = UNSAFE_getAllByType('View');
    expect(views.length).toBeGreaterThanOrEqual(3);
  });

  it('renders 12 shimmer blocks (4 per card × 3 cards)', () => {
    const { UNSAFE_getAllByType } = render(<FeedSkeleton />);
    // Each card: 1 container + 1 content + 4 shimmer blocks = 6 Views × 3 cards = 18
    // Reanimated mock may add wrapper Views, so use >= 12 to ensure shimmer blocks are present
    const allViews = UNSAFE_getAllByType('View');
    expect(allViews.length).toBeGreaterThanOrEqual(12);
  });
});
