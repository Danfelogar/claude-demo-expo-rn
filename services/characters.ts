import { apiClient } from './api';
import type { CharacterPage } from '@/types/character';

export async function fetchCharacters(page: number): Promise<CharacterPage> {
  const response = await apiClient.get<CharacterPage>('/character', {
    params: { page },
  });
  return response.data;
}
