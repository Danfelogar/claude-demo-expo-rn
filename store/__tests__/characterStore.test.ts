import { useCharacterStore } from '../characterStore';

describe('useCharacterStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useCharacterStore.setState({ favorites: [], selectedStatus: 'all' });
  });

  describe('favorites', () => {
    it('starts with an empty favorites list', () => {
      const { favorites } = useCharacterStore.getState();
      expect(favorites).toEqual([]);
    });

    it('adds a character to favorites', () => {
      useCharacterStore.getState().toggleFavorite(1);
      expect(useCharacterStore.getState().favorites).toContain(1);
    });

    it('removes a character from favorites on second toggle', () => {
      useCharacterStore.getState().toggleFavorite(1);
      useCharacterStore.getState().toggleFavorite(1);
      expect(useCharacterStore.getState().favorites).not.toContain(1);
    });

    it('supports multiple favorites', () => {
      useCharacterStore.getState().toggleFavorite(1);
      useCharacterStore.getState().toggleFavorite(2);
      useCharacterStore.getState().toggleFavorite(3);
      expect(useCharacterStore.getState().favorites).toEqual([1, 2, 3]);
    });

    it('removing one favorite keeps others', () => {
      useCharacterStore.getState().toggleFavorite(1);
      useCharacterStore.getState().toggleFavorite(2);
      useCharacterStore.getState().toggleFavorite(1);
      expect(useCharacterStore.getState().favorites).toEqual([2]);
    });
  });

  describe('selectedStatus', () => {
    it('starts with "all"', () => {
      const { selectedStatus } = useCharacterStore.getState();
      expect(selectedStatus).toBe('all');
    });

    it('changes to Alive', () => {
      useCharacterStore.getState().setSelectedStatus('Alive');
      expect(useCharacterStore.getState().selectedStatus).toBe('Alive');
    });

    it('changes to Dead', () => {
      useCharacterStore.getState().setSelectedStatus('Dead');
      expect(useCharacterStore.getState().selectedStatus).toBe('Dead');
    });

    it('changes to unknown', () => {
      useCharacterStore.getState().setSelectedStatus('unknown');
      expect(useCharacterStore.getState().selectedStatus).toBe('unknown');
    });

    it('resets back to all', () => {
      useCharacterStore.getState().setSelectedStatus('Dead');
      useCharacterStore.getState().setSelectedStatus('all');
      expect(useCharacterStore.getState().selectedStatus).toBe('all');
    });
  });
});
