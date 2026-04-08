import { create } from 'zustand';
import type { CharacterStatus } from '@/types/character';

export type StatusFilter = 'all' | CharacterStatus;

interface CharacterState {
  favorites: number[];
  selectedStatus: StatusFilter;
  toggleFavorite: (id: number) => void;
  setSelectedStatus: (status: StatusFilter) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  favorites: [],
  selectedStatus: 'all',

  toggleFavorite: (id: number) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((fid) => fid !== id)
        : [...state.favorites, id],
    })),

  setSelectedStatus: (status: StatusFilter) =>
    set({ selectedStatus: status }),
}));
