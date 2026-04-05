/** Category tags for feed cards */
export enum FeedCategory {
  Technology = 'Technology',
  Design = 'Design',
  Business = 'Business',
  Health = 'Health',
  Education = 'Education',
}

/** Shape of a single feed item */
export interface FeedItem {
  id: string;
  title: string;
  description: string;
  category: FeedCategory;
  imageUrl: string;
  timestamp: Date;
}

/** Category-specific pastel colors for light/dark mode */
export const categoryColors = {
  [FeedCategory.Technology]: { light: '#DBEAFE', dark: '#1E3A5F' },
  [FeedCategory.Design]: { light: '#FCE7F3', dark: '#4A1942' },
  [FeedCategory.Business]: { light: '#D1FAE5', dark: '#064E3B' },
  [FeedCategory.Health]: { light: '#FEF3C7', dark: '#78350F' },
  [FeedCategory.Education]: { light: '#E0E7FF', dark: '#3730A3' },
} as const;

/** Text color for category tags in light/dark mode */
export const categoryTextColors = {
  [FeedCategory.Technology]: { light: '#1E40AF', dark: '#BFDBFE' },
  [FeedCategory.Design]: { light: '#BE185D', dark: '#FBCFE8' },
  [FeedCategory.Business]: { light: '#065F46', dark: '#A7F3D0' },
  [FeedCategory.Health]: { light: '#92400E', dark: '#FDE68A' },
  [FeedCategory.Education]: { light: '#3730A3', dark: '#C7D2FE' },
} as const;

export type CategoryColors = typeof categoryColors;
export type CategoryTextColors = typeof categoryTextColors;
