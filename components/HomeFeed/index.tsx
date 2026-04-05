import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { FeedItemCard } from '@/components/FeedItemCard';
import { FeedSkeleton } from '@/components/FeedSkeleton';
import { useFeed } from '@/hooks/useFeed';
import type { FeedItem } from '@/types/feed';

export function HomeFeed() {
  const { data, isLoading, error } = useFeed();
  const background = useThemeColor({}, 'background');
  const subtitleColor = useThemeColor({ light: '#6B7280', dark: '#9CA3AF' }, 'icon');

  const renderItem = useCallback(({ item }: { item: FeedItem }) => {
    return <FeedItemCard item={item} />;
  }, []);

  const keyExtractor = useCallback((item: FeedItem) => item.id, []);

  // FlashList requires a number for estimatedItemSize.
  // Measured from a rendered card: ~220px.
  const estimatedItemSize = 220;

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: background }]}>
        <ThemedText type="subtitle">Something went wrong</ThemedText>
        <ThemedText style={[styles.errorText, { color: subtitleColor }]}>{error}</ThemedText>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: background }]}>
        <ThemedText type="subtitle">No items yet</ThemedText>
        <ThemedText style={[styles.errorText, { color: subtitleColor }]}>
          Check back later for new content.
        </ThemedText>
      </View>
    );
  }

  return (
    <Animated.View style={styles.fill} entering={FadeIn}>
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={estimatedItemSize}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 14,
  },
});
