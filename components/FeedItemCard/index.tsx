import { memo } from 'react';
import { Alert, Platform, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import type { FeedItem, FeedCategory } from '@/types/feed';
import { categoryColors, categoryTextColors } from '@/types/feed';

interface FeedItemCardProps {
  item: FeedItem;
}

/** Map category to its background/text colors based on current theme */
function getCategoryStyle(category: FeedCategory, scheme: 'light' | 'dark') {
  return {
    bg: categoryColors[category][scheme],
    text: categoryTextColors[category][scheme],
  };
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export const FeedItemCard = memo(function FeedItemCard({ item }: FeedItemCardProps) {
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1E1E1E' }, 'background');
  const subtitleColor = useThemeColor({ light: '#6B7280', dark: '#9CA3AF' }, 'icon');
  const scheme = useColorScheme() || 'light';
  const catStyle = getCategoryStyle(item.category, scheme);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(item.title);
  };

  return (
    <Animated.View entering={FadeInDown.delay(80).springify()}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: cardBg },
          pressed && styles.cardPressed,
        ]}
        accessibilityLabel={`${item.title}, ${item.category}`}
        accessibilityRole="button"
        accessibilityHint="Shows details about this feed item">
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />

        <View style={styles.content}>
          <View style={[styles.categoryTag, { backgroundColor: catStyle.bg }]}>
            <ThemedText
              style={[styles.categoryText, { color: catStyle.text }]}
              type="defaultSemiBold">
              {item.category}
            </ThemedText>
          </View>

          <ThemedText type="defaultSemiBold" numberOfLines={2} style={styles.title}>
            {item.title}
          </ThemedText>

          <ThemedText
            numberOfLines={2}
            style={[styles.description, { color: subtitleColor }]}>
            {item.description}
          </ThemedText>

          <ThemedText style={[styles.timestamp, { color: subtitleColor }]}>
            {formatTimestamp(item.timestamp)}
          </ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  cardPressed: {
    opacity: 0.92,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  content: {
    padding: 12,
    gap: 6,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
});
