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

interface ShimmerBlockProps {
  style: { width?: number | string; height?: number; borderRadius?: number };
  base: string;
  highlight: string;
}

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
      style={[style, { backgroundColor: highlight }, animatedStyle]}
    />
  );
}

/** Skeleton placeholder for character cards while data loads */
export function CharacterSkeleton() {
  const cardBg = useThemeColor({ light: '#FFFFFF', dark: '#1E1E1E' }, 'background');
  const shimmerBase = useThemeColor({ light: '#E5E7EB', dark: '#374151' }, 'icon');
  const shimmerHighlight = useThemeColor({ light: '#F3F4F6', dark: '#4B5563' }, 'icon');

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={[styles.card, { backgroundColor: cardBg }]}>
          <ShimmerBlock style={styles.avatar} base={shimmerBase} highlight={shimmerHighlight} />
          <View style={styles.content}>
            <ShimmerBlock style={styles.nameBlock} base={shimmerBase} highlight={shimmerHighlight} />
            <ShimmerBlock style={styles.statusBlock} base={shimmerBase} highlight={shimmerHighlight} />
            <ShimmerBlock style={styles.originBlock} base={shimmerBase} highlight={shimmerHighlight} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 8,
    justifyContent: 'center',
  },
  nameBlock: { height: 18, width: '60%', borderRadius: 4 },
  statusBlock: { height: 14, width: '40%', borderRadius: 4 },
  originBlock: { height: 12, width: '50%', borderRadius: 4 },
});
