import { memo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { useCharacterStore } from '@/store/characterStore';
import type { CharacterStatus } from '@/types/character';

export interface CharacterCardProps {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  image: string;
  originName: string;
  index: number;
}

const STATUS_COLORS: Record<CharacterStatus, string> = {
  Alive: '#22C55E',
  Dead: '#EF4444',
  unknown: '#9CA3AF',
};

export const CharacterCard = memo(function CharacterCard({
  id,
  name,
  status,
  species,
  image,
  originName,
  index,
}: CharacterCardProps) {
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1E1E1E' }, 'background');
  const subtitleColor = useThemeColor({ light: '#6B7280', dark: '#9CA3AF' }, 'icon');
  const favorites = useCharacterStore((s) => s.favorites);
  const toggleFavorite = useCharacterStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(id);

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: cardBg },
          pressed && styles.cardPressed,
        ]}
        accessibilityLabel={`${name}, ${status}, ${species}`}
        accessibilityRole="button"
        accessibilityHint="Shows details about this character">
        <Image
          source={{ uri: image }}
          style={styles.avatar}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.name}>
              {name}
            </ThemedText>
            <Pressable
              onPress={() => toggleFavorite(id)}
              accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityRole="button"
              hitSlop={8}>
              <ThemedText style={[styles.heart, isFav && styles.heartActive]}>
                {isFav ? '\u2665' : '\u2661'}
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.meta}>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[status] }]} />
            <ThemedText style={[styles.statusText, { color: subtitleColor }]}>
              {status} — {species}
            </ThemedText>
          </View>

          <ThemedText numberOfLines={1} style={[styles.origin, { color: subtitleColor }]}>
            Origin: {originName}
          </ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 6,
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
  avatar: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    flex: 1,
  },
  heart: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  heartActive: {
    color: '#EF4444',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
  },
  origin: {
    fontSize: 12,
  },
});
