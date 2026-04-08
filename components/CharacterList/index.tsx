import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { CharacterCard } from '@/components/CharacterCard';
import { CharacterSkeleton } from '@/components/CharacterSkeleton';
import { useCharacters } from '@/hooks/useCharacters';
import { useCharacterStore } from '@/store/characterStore';
import type { Character } from '@/types/character';
import type { StatusFilter } from '@/store/characterStore';

const FILTERS: StatusFilter[] = ['all', 'Alive', 'Dead', 'unknown'];

export function CharacterList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, isFetching } = useCharacters(page);
  const background = useThemeColor({}, 'background');
  const subtitleColor = useThemeColor({ light: '#6B7280', dark: '#9CA3AF' }, 'icon');
  const chipBg = useThemeColor({ light: '#F3F4F6', dark: '#374151' }, 'background');
  const chipActiveBg = useThemeColor({ light: '#DBEAFE', dark: '#1E3A5F' }, 'background');
  const selectedStatus = useCharacterStore((s) => s.selectedStatus);
  const setSelectedStatus = useCharacterStore((s) => s.setSelectedStatus);

  const filteredData = data?.results.filter(
    (c) => selectedStatus === 'all' || c.status === selectedStatus
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Character; index: number }) => (
      <CharacterCard
        id={item.id}
        name={item.name}
        status={item.status}
        species={item.species}
        image={item.image}
        originName={item.origin.name}
        index={index}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((item: Character) => String(item.id), []);

  const handleEndReached = useCallback(() => {
    if (data?.info.next && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [data?.info.next, isFetching]);

  if (isLoading) {
    return <CharacterSkeleton />;
  }

  if (isError) {
    return (
      <View style={[styles.center, { backgroundColor: background }]}>
        <ThemedText type="subtitle">Something went wrong</ThemedText>
        <ThemedText style={[styles.errorText, { color: subtitleColor }]}>
          {error?.message ?? 'Unknown error'}
        </ThemedText>
      </View>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: background }]}>
        <FilterBar
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          chipBg={chipBg}
          chipActiveBg={chipActiveBg}
        />
        <ThemedText type="subtitle">No characters found</ThemedText>
      </View>
    );
  }

  return (
    <Animated.View style={styles.fill} entering={FadeIn}>
      <FilterBar
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        chipBg={chipBg}
        chipActiveBg={chipActiveBg}
      />
      <FlashList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={112}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </Animated.View>
  );
}

interface FilterBarProps {
  selectedStatus: StatusFilter;
  setSelectedStatus: (s: StatusFilter) => void;
  chipBg: string;
  chipActiveBg: string;
}

function FilterBar({ selectedStatus, setSelectedStatus, chipBg, chipActiveBg }: FilterBarProps) {
  const chipTextColor = useThemeColor({ light: '#374151', dark: '#D1D5DB' }, 'text');

  return (
    <View style={styles.filterBar} accessibilityRole="tablist">
      {FILTERS.map((f) => {
        const isActive = f === selectedStatus;
        return (
          <Pressable
            key={f}
            onPress={() => setSelectedStatus(f)}
            style={[styles.chip, { backgroundColor: isActive ? chipActiveBg : chipBg }]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}>
            <ThemedText style={[styles.chipText, { color: chipTextColor }]}>{f}</ThemedText>
          </Pressable>
        );
      })}
    </View>
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
});
