import { useQuery } from '@tanstack/react-query';
import { fetchCharacters } from '@/services/characters';
import type { CharacterPage } from '@/types/character';

export function useCharacters(page: number) {
  return useQuery<CharacterPage, Error>({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
    staleTime: 5 * 60 * 1000,
  });
}
