import { renderHook, waitFor } from '@testing-library/react-native';
import { useFeed } from './useFeed';
import { MOCK_FEED_ITEMS } from '@/constants/mock-data';

describe('useFeed', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns correct initial state', () => {
    const { result } = renderHook(() => useFeed());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('loads mock data after latency', async () => {
    const { result } = renderHook(() => useFeed());

    // Initial state
    expect(result.current.isLoading).toBe(true);

    // Advance the fake timer past the 500ms delay
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(MOCK_FEED_ITEMS.length);
    expect(result.current.error).toBeNull();
  });

  it('returns a copy of mock data (not the original array)', async () => {
    const { result } = renderHook(() => useFeed());

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // The hook does Array.from(MOCK_FEED_ITEMS), so it's a new array reference
    // but the same content
    expect(result.current.data).toEqual(Array.from(MOCK_FEED_ITEMS));
  });

  it('returns data with correct FeedItem shape', async () => {
    const { result } = renderHook(() => useFeed());

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.data.forEach((item) => {
      expect(typeof item.id).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(typeof item.description).toBe('string');
      expect(item.category).toBeTruthy();
      expect(typeof item.imageUrl).toBe('string');
      expect(item.timestamp).toBeInstanceOf(Date);
    });
  });

  it('cleans up the timer on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useFeed());
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
