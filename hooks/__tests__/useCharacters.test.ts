import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useCharacters } from '../useCharacters';
import { fetchCharacters } from '@/services/characters';
import type { CharacterPage } from '@/types/character';

jest.mock('@/services/characters', () => ({
  fetchCharacters: jest.fn(),
}));

const mockedFetch = fetchCharacters as jest.MockedFunction<typeof fetchCharacters>;

const mockPage: CharacterPage = {
  info: { count: 826, pages: 42, next: 'url', prev: null },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Earth', url: '' },
      image: 'https://example.com/1.jpeg',
      episode: [],
      url: '',
      created: '',
    },
  ],
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCharacters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data on success', async () => {
    mockedFetch.mockResolvedValue(mockPage);

    const { result } = renderHook(() => useCharacters(1), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      expect(result.current.data).toEqual(mockPage);
      expect(result.current.data?.results[0].name).toBe('Rick Sanchez');
    });
    expect(mockedFetch).toHaveBeenCalledWith(1);
  });

  it('returns error on failure', async () => {
    mockedFetch.mockRejectedValue(new Error('API down'));

    const { result } = renderHook(() => useCharacters(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    await act(async () => {
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('API down');
    });
  });

  it('calls fetchCharacters with the correct page', async () => {
    mockedFetch.mockResolvedValue(mockPage);

    renderHook(() => useCharacters(3), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith(3));
  });
});
