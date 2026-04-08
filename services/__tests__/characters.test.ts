import { fetchCharacters } from '../characters';
import { apiClient } from '../api';
import type { CharacterPage } from '@/types/character';

jest.mock('../api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const mockedGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>;

const mockPage: CharacterPage = {
  info: { count: 826, pages: 42, next: 'https://rickandmortyapi.com/api/character?page=2', prev: null },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth (C-137)', url: '' },
      location: { name: 'Citadel of Ricks', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: [],
      url: '',
      created: '',
    },
  ],
};

describe('fetchCharacters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns character data on success', async () => {
    mockedGet.mockResolvedValue({ data: mockPage });

    const result = await fetchCharacters(1);

    expect(mockedGet).toHaveBeenCalledWith('/character', { params: { page: 1 } });
    expect(result).toEqual(mockPage);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe('Rick Sanchez');
  });

  it('passes the correct page number', async () => {
    mockedGet.mockResolvedValue({ data: mockPage });

    await fetchCharacters(5);

    expect(mockedGet).toHaveBeenCalledWith('/character', { params: { page: 5 } });
  });

  it('throws on network error', async () => {
    mockedGet.mockRejectedValue(new Error('Network Error'));

    await expect(fetchCharacters(1)).rejects.toThrow('Network Error');
  });
});
