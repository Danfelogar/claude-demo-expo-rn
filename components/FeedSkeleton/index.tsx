import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { useThemeColor } from '@/hooks/use-theme-color';

/** Skeleton shimmer placeholder used while feed data loads */
export function FeedSkeleton() {
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1E1E1E' }, 'background');
  const shimmerBase = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'icon');
  const shimmerHighlight = useThemeColor({ light: '#F3F4F6', dark: '#4B5563' }, 'icon');

  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.card, { backgroundColor: cardBg }]}>
          <ShimmerBlock style={styles.thumbnail} base={shimmerBase} highlight={shimmerHighlight} />
          <View style={styles.content}>
            <ShimmerBlock style={styles.tagSmall} base={shimmerBase} highlight={shimmerHighlight} />
            <ShimmerBlock style={styles.tagLarge} base={shimmerBase} highlight={shimmerHighlight} />
            <ShimmerBlock style={styles.tagWide} base={shimmerBase} highlight={shimmerHighlight} />
            <ShimmerBlock style={[styles.tagSmall, { width: 50 }]} base={shimmerBase} highlight={shimmerHighlight} />
          </View>
        </View>
      ))}
    </View>
  );
}

interface ShimmerBlockProps {
  style: { width?: number | string; height?: number };
  base: string;
  highlight: string;
}

/** Single shimmer rectangle that pulses between two colors */
function ShimmerBlock({ style, base, highlight }: ShimmerBlockProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 1000 })
      ),
      -1
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + progress.value * 0.6,
  }));

  return (
    <Animated.View
      style={[
        style,
        { backgroundColor: highlight },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  content: {
    padding: 12,
    gap: 8,
  },
  tagSmall: { height: 16, width: 60, borderRadius: 4 },
  tagLarge: { height: 18, width: '70%', borderRadius: 4 },
  tagWide: { height: 16, width: '100%', borderRadius: 4 },
});
