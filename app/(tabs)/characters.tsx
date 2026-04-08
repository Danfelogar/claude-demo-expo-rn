import { StyleSheet, View } from 'react-native';

import { CharacterList } from '@/components/CharacterList';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CharactersScreen() {
  const background = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <CharacterList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
