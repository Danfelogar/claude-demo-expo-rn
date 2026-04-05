import { useEffect, useMemo, useState } from 'react';
import type { FeedItem } from '@/types/feed';
import { MOCK_FEED_ITEMS } from '@/constants/mock-data';

interface UseFeedResult {
  data: FeedItem[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch feed items — currently returns mock data.
 * Signature matches TanStack Query's useQuery shape so the UI layer
 * does not need to change when switching to a real API.
 */
export function useFeed(): UseFeedResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FeedItem[]>([]);

  useEffect(() => {
    // Simulate network latency so loading state is exercised
    const timer = setTimeout(() => {
      try {
        setData(Array.from(MOCK_FEED_ITEMS));
        setIsLoading(false);
      } catch {
        setError('Failed to load feed');
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return useMemo(
    () => ({ data, isLoading, error }),
    [data, isLoading, error],
  );
}
