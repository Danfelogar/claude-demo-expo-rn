import { FeedCategory } from '@/types/feed';
import { MOCK_FEED_ITEMS } from '@/constants/mock-data';

describe('MOCK_FEED_ITEMS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(MOCK_FEED_ITEMS)).toBe(true);
    expect(MOCK_FEED_ITEMS.length).toBeGreaterThan(0);
  });

  it('each item has all required FeedItem fields', () => {
    MOCK_FEED_ITEMS.forEach((item) => {
      expect(typeof item.id).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(typeof item.description).toBe('string');
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(0);
    });
  });

  it('each item has a valid FeedCategory', () => {
    const validCategories = Object.values(FeedCategory);
    MOCK_FEED_ITEMS.forEach((item) => {
      expect(validCategories).toContain(item.category);
    });
  });

  it('each item has imageUrl and timestamp fields', () => {
    MOCK_FEED_ITEMS.forEach((item) => {
      expect(typeof item.imageUrl).toBe('string');
      expect(item.imageUrl.length).toBeGreaterThan(0);
      expect(item.timestamp).toBeInstanceOf(Date);
      expect(isNaN(item.timestamp.getTime())).toBe(false);
    });
  });

  it('all ids are unique', () => {
    const ids = MOCK_FEED_ITEMS.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
